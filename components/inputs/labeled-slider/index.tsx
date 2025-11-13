import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@/components/ui/slider';

interface LabeledSliderProps {
    label: string;
    value: number;
    minValue: number;
    maxValue: number;
    step: number;
    onChange: (value: number) => void;
    suffix?: string;
    className?: string;
}

export default function LabeledSlider({
    label,
    value,
    minValue,
    maxValue,
    step,
    onChange,
    suffix = '%',
    className = '',
}: LabeledSliderProps) {
    return (
        <VStack space="xs" className={className}>
            <HStack className="justify-between items-center mb-2">
                <Text size="sm" className="text-gray-900 font-medium">
                    {label}
                </Text>
                <Text size="md" className="text-primary-500 font-semibold">
                    {value}{suffix}
                </Text>
            </HStack>
            <Slider
                value={value}
                minValue={minValue}
                maxValue={maxValue}
                step={step}
                onChange={onChange}
                size="md"
            >
                <SliderTrack>
                    <SliderFilledTrack className="bg-primary-500" />
                </SliderTrack>
                <SliderThumb className="bg-primary-500" />
            </Slider>
            <HStack className="justify-between items-center mt-1">
                <Text size="xs" className="text-gray-500">
                    {minValue}{suffix}
                </Text>
                <Text size="xs" className="text-gray-500">
                    {maxValue}{suffix}
                </Text>
            </HStack>
        </VStack>
    );
}
