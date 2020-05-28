<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\JsonSchema;

use Akeneo\ReferenceEntity\Domain\Model\Attribute\AbstractAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\JsonSchema\TableAttributeEditValidator;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use PhpSpec\ObjectBehavior;

class TableAttributeEditValidatorSpec extends ObjectBehavior
{
    function it_is_initializable()
    {
        $this->shouldHaveType(TableAttributeEditValidator::class);
    }

    public function it_does_support_attribute_type(TableAttribute $attribute): void
    {
        $this->support($attribute)->shouldReturn(true);
    }

    public function it_does_not_support_attribute_type(AbstractAttribute $attribute): void
    {
        $this->support($attribute)->shouldReturn(false);
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
            '_links' => ['link' => ''],
        ];

        $this->validate($normalizedAttribute)->shouldReturn([]);
    }

    public function it_does_validate_valid_minmal_data(): void
    {
        $normalizedAttribute = [
            'code' => 'code',
        ];

        $this->validate($normalizedAttribute)->shouldReturn([]);
    }

    public function it_does_validate_invalid_data(): void
    {
        $missingElement = [
            'type' => 'flagbit_table',
            'value_per_locale' => false,
            'value_per_channel' => false,
        ];

        $this->validate($missingElement)->shouldNotReturn([]);

        $this->validate([])->shouldNotReturn([]);

        $invalidTypes = [
            'code' => 1,
            'type' => 'flagbit_table',
            'value_per_locale' => 'false',
            'value_per_channel' => 'false',
        ];

        $this->validate($invalidTypes)->shouldHaveCount(3);
    }
}
