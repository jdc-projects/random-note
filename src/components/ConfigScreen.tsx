"use client";

import { useForm } from "@mantine/form";
import {
  Select,
  Switch,
  NumberInput,
  Button,
  Stack,
  Title,
  Divider,
  Group,
  ComboboxItem,
} from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";
import type { AppConfig } from "@/lib/types";
import {
  CLEF_OPTIONS,
  TRANSPOSITION_OPTIONS,
  MAJOR_KEYS_SHARP,
  MAJOR_KEYS_FLAT,
  MINOR_KEYS_SHARP,
  MINOR_KEYS_FLAT,
  KEY_SIGNATURES,
} from "@/lib/constants";

interface ConfigScreenProps {
  initialConfig: AppConfig;
  onStart: (config: AppConfig) => void;
}

function makeKeyOption(name: string): {
  value: string;
  label: string;
} {
  const sig = KEY_SIGNATURES[name];
  const count = sig ? sig.accidentals.length : 0;
  const accType =
    count > 0 && sig.accidentals[0].accidental === "sharp" ? "#" : "b";
  const accStr = count === 0 ? "0" : `${count}${accType}`;
  return { value: name, label: `${name} (${accStr})` };
}

export function ConfigScreen({ initialConfig, onStart }: ConfigScreenProps) {
  const form = useForm<AppConfig>({
    initialValues: initialConfig,
    validate: {
      ledgerLinesAbove: (v) => (v < 0 || v > 10 ? "Must be 0–10" : null),
      ledgerLinesBelow: (v) => (v < 0 || v > 10 ? "Must be 0–10" : null),
      timerSeconds: (v) =>
        v !== null && (v < 1 || v > 60) ? "Must be 1–60 seconds" : null,
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    const config: AppConfig = {
      ...values,
      doubleAccidentals: values.singleAccidentals
        ? values.doubleAccidentals
        : false,
    };
    onStart(config);
  });

  const keyOptions = [
    {
      group: "Major (Sharps)",
      items: MAJOR_KEYS_SHARP.map((k) => makeKeyOption(k)),
    },
    {
      group: "Major (Flats)",
      items: MAJOR_KEYS_FLAT.map((k) => makeKeyOption(k)),
    },
    {
      group: "Minor (Sharps)",
      items: MINOR_KEYS_SHARP.map((k) => makeKeyOption(k)),
    },
    {
      group: "Minor (Flats)",
      items: MINOR_KEYS_FLAT.map((k) => makeKeyOption(k)),
    },
  ];

  const timerOptions: ComboboxItem[] = [
    { label: "No timer", value: "null" },
    { label: "5 seconds", value: "5" },
    { label: "10 seconds", value: "10" },
    { label: "15 seconds", value: "15" },
    { label: "20 seconds", value: "20" },
    { label: "30 seconds", value: "30" },
    { label: "60 seconds", value: "60" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Title order={2}>Random Note Generator</Title>

        <Select
          label="Clef"
          data={CLEF_OPTIONS}
          {...form.getInputProps("clef")}
        />

        <Select
          label="Key Signature"
          data={keyOptions}
          {...form.getInputProps("keySignature")}
        />

        <Switch
          label="Single Accidentals"
          {...form.getInputProps("singleAccidentals", { type: "checkbox" })}
        />

        <Switch
          label="Double Accidentals"
          disabled={!form.values.singleAccidentals}
          {...form.getInputProps("doubleAccidentals", { type: "checkbox" })}
        />

        <Select
          label="Pitch (Transposition)"
          data={TRANSPOSITION_OPTIONS}
          {...form.getInputProps("transposition")}
        />

        <NumberInput
          label="Ledger Lines Above"
          min={0}
          max={10}
          {...form.getInputProps("ledgerLinesAbove")}
        />

        <NumberInput
          label="Ledger Lines Below"
          min={0}
          max={10}
          {...form.getInputProps("ledgerLinesBelow")}
        />

        <Select
          label="Timer"
          data={timerOptions}
          value={
            form.values.timerSeconds === null
              ? "null"
              : String(form.values.timerSeconds)
          }
          onChange={(val) => {
            form.setFieldValue(
              "timerSeconds",
              val === "null" ? null : Number(val),
            );
          }}
          searchable
          allowDeselect={false}
        />

        <Divider />

        <Group justify="flex-end">
          <Button type="submit" leftSection={<IconPlayerPlay size={16} />}>
            Start
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
