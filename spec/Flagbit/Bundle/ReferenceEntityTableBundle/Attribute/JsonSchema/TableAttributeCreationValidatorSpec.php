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

    public function it_does_validate_valid_data(): void
    {
        $normalizedAttribute = [
            'code' => 'code',
            'type' => 'flagbit_table',
            'value_per_locale' => false,
            'value_per_channel' => false,
            'is_required_for_completeness' => false,
            'labels' => ['de_DE' => 'fuu', 'en_US' => 'foo'],
        ];

        $this->validate($normalizedAttribute)->shouldReturn([]);
    }

    public function it_does_validate_valid_minimal_data(): void
    {
        $normalizedAttribute = [
            'code' => 'code',
            'type' => 'flagbit_table',
            'value_per_locale' => false,
            'value_per_channel' => false,
        ];

        $this->validate($normalizedAttribute)->shouldReturn([]);
    }

    public function it_does_validate_invalid_data(): void
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
}
