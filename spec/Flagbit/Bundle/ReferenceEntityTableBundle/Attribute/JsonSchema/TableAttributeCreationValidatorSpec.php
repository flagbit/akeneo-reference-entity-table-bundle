<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\JsonSchema;

use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\JsonSchema\TableAttributeCreationValidator;
use PhpSpec\ObjectBehavior;

class TableAttributeCreationValidatorSpec extends ObjectBehavior
{
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(TableAttributeCreationValidator::class);
    }

    public function it_is_for_table_attribute_type(): void
    {
        $this->forAttributeTypes()->shouldReturn(['flagbit_table']);
    }

    public function it_does_validate_simple_attribute_valid_data(): void
    {
        $this->validate($this->getNormalizedBasicAttribute())->shouldReturn([]);
    }

    public function it_does_validate_minmal_valid_data(): void
    {
        $normalizedAttribute = [
            'code' => 'code',
            'type' => 'flagbit_table',
            'value_per_locale' => false,
            'value_per_channel' => false,
        ];

        $this->validate($normalizedAttribute)->shouldReturn([]);
    }

    public function it_does_validate_simple_attribute_invalid_data(): void
    {
        $this->validate([])->shouldNotReturn([]);

        $invalidTypes = [
            'code' => 1,
            'type' => 'flagbit_table',
            'value_per_locale' => 'false',
            'value_per_channel' => 'false',
            'is_required_for_completeness' => '0',
            '_links' => [],
        ];

        $this->validate($invalidTypes)->shouldHaveCount(5);
    }

    public function it_does_validate_with_table_property_valid_data(): void
    {
        $normalizedAttribute = $this->getNormalizedBasicAttribute();
        $normalizedAttribute['table_property'] = [
            [
                'code' => 'test1',
                'type' => 'number',
                'config' => [
                    'decimal' => 'true'
                ],
                'labels' => [
                    'de_DE' => 'DE Test 1',
                    'en_US' => 'US Test 1',
                    'fr_FR' => 'FR Test 1'
                ],
                'validations' => []
            ],
            [
                'code' => 'test2',
                'type' => 'text',
                'config' => [],
                'labels' => [
                    'de_DE' => 'DE Test 2',
                    'fr_FR' => 'FR Test 2'
                ],
                'validations' => []
            ],
        ];

        $this->validate($normalizedAttribute)->shouldReturn([]);
    }

    public function it_does_validate_with_empty_table_property_valid_data(): void
    {
        $normalizedAttribute = $this->getNormalizedBasicAttribute();
        $normalizedAttribute['table_property'] = [];

        $this->validate($normalizedAttribute)->shouldReturn([]);
    }

    public function it_does_validate_with_table_property_invalid_code(): void
    {
        $normalizedAttribute = $this->getNormalizedBasicAttribute();
        $normalizedAttribute['table_property'] = [
            [
                'code' => ['code'],
                'type' => 'text',
                'config' => [],
                'labels' => ['foo' => 'foo'],
                'validations' => []
            ],
        ];

        $this->validate($normalizedAttribute)->shouldHaveCount(1);
    }

    public function it_does_validate_with_table_property_invalid_labels(): void
    {
        $normalizedAttribute = $this->getNormalizedBasicAttribute();
        $normalizedAttribute['table_property'] = [
            [
                'code' => 'code',
                'type' => 'text',
                'config' => [],
                'labels' => 'en_US,de_DE',
                'validations' => []
            ],
        ];

        $this->validate($normalizedAttribute)->shouldHaveCount(1);
    }

    public function it_does_validate_with_table_property_invalid_type(): void
    {
        $normalizedAttribute = $this->getNormalizedBasicAttribute();
        $normalizedAttribute['table_property'] = [
            [
                'code' => 'code',
                'type' => '3333',
                'config' => [],
                'labels' => ['foo' => 'foo'],
                'validations' => []
            ],
        ];

        $this->validate($normalizedAttribute)->shouldHaveCount(1);
    }

    public function it_does_validate_with_table_property_invalid_config(): void
    {
        $normalizedAttribute = $this->getNormalizedBasicAttribute();
        $normalizedAttribute['table_property'] = [
            [
                'code' => 'code',
                'type' => 'text',
                'config' => 'default',
                'labels' => ['foo' => 'foo'],
                'validations' => []
            ],
        ];

        $this->validate($normalizedAttribute)->shouldHaveCount(1);
    }

    private function getNormalizedBasicAttribute(): array
    {
        return [
            'code' => 'code',
            'type' => 'flagbit_table',
            'value_per_locale' => false,
            'value_per_channel' => false,
            'is_required_for_completeness' => false,
            'labels' => ['de_DE' => 'fuu', 'en_US' => 'foo'],
        ];
    }
}
