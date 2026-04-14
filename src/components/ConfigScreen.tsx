"use client";

import { useForm } from "@mantine/form";
import { useState } from "react";
import {
  Select,
  Switch,
  NumberInput,
  Button,
  Stack,
  Title,
  Divider,
  Group,
  Slider,
  Collapse,
  UnstyledButton,
  Text,
} from "@mantine/core";
import { IconPlayerPlay, IconVolume, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import type { AppConfig, InstrumentType } from "@/lib/types";
import {
  CLEF_OPTIONS,
  TRANSPOSITION_OPTIONS,
  MAJOR_KEYS_SHARP,
  MAJOR_KEYS_FLAT,
  MINOR_KEYS_SHARP,
  MINOR_KEYS_FLAT,
  KEY_SIGNATURES,
} from "@/lib/constants";

const INSTRUMENT_LABELS: Record<InstrumentType, string> = {
  sine: "Sine Wave",
  acoustic_grand_piano: "Piano",
  trumpet: "Trumpet / Cornet",
  trombone: "Trombone",
  tuba: "Tuba",
};

const INSTRUMENT_SELECT_OPTIONS = Object.entries(INSTRUMENT_LABELS).map(
  ([value, label]) => ({ value, label }),
);

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
  const [advancedOpen, setAdvancedOpen] = useState(false);

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

  const TIMER_VALUES = [0, 1, 2, 3, 4, 5, 10, 20, 30, 60];
  const TIMER_LABELS: Record<number, string> = {
    0: "No timer",
    1: "1s",
    2: "2s",
    3: "3s",
    4: "4s",
    5: "5s",
    10: "10s",
    20: "20s",
    30: "30s",
    60: "60s",
  };

  const timerIndex = TIMER_VALUES.indexOf(
    form.values.timerSeconds ?? 0,
  );

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

        <Switch
          label="Sound"
          labelPosition="left"
          {...form.getInputProps("soundEnabled", { type: "checkbox" })}
          thumbIcon={
            form.values.soundEnabled ? (
              <IconVolume size={12} stroke={1.5} />
            ) : undefined
          }
        />

        {form.values.soundEnabled && (
          <Select
            label="Instrument"
            data={INSTRUMENT_SELECT_OPTIONS}
            {...form.getInputProps("instrument")}
          />
        )}

        <Switch
          label="8vb (one octave lower)"
          labelPosition="left"
          {...form.getInputProps("octaveShift", { type: "checkbox" })}
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

        <Stack gap={4} mb="md" px="xs">
          <Text size="sm" fw={500}>
            Timer: {TIMER_LABELS[form.values.timerSeconds ?? 0]}
          </Text>
          <Slider
            min={0}
            max={TIMER_VALUES.length - 1}
            step={1}
            value={timerIndex === -1 ? 0 : timerIndex}
            onChange={(idx) => {
              const val = TIMER_VALUES[idx];
              form.setFieldValue("timerSeconds", val === 0 ? null : val);
            }}
            marks={TIMER_VALUES.map((v, i) => ({
              value: i,
              label: i % 3 === 0 || i === TIMER_VALUES.length - 1 ? TIMER_LABELS[v] : undefined,
            }))}
            label={null}
          />
        </Stack>

        <Divider />

        <UnstyledButton onClick={() => setAdvancedOpen((o) => !o)}>
          <Group gap={4}>
            <Text fw={500} size="sm">
              Advanced Settings
            </Text>
            {advancedOpen ? (
              <IconChevronUp size={14} />
            ) : (
              <IconChevronDown size={14} />
            )}
          </Group>
        </UnstyledButton>
        <Collapse expanded={advancedOpen}>
          <Stack gap="md" pl="md">
            <NumberInput
              label="Single Accidental Chance (%)"
              min={0}
              max={100}
              disabled={!form.values.singleAccidentals}
              {...form.getInputProps("singleAccidentalChance")}
            />
            <NumberInput
              label="Double Accidental Chance (%)"
              min={0}
              max={100}
              disabled={!form.values.doubleAccidentals}
              {...form.getInputProps("doubleAccidentalChance")}
            />
          </Stack>
        </Collapse>

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
