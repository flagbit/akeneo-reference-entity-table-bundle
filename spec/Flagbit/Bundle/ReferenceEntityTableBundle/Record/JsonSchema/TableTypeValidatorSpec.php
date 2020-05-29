<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Record\JsonSchema;

use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\JsonSchema\TableTypeValidator;
use PhpSpec\ObjectBehavior;

class TableTypeValidatorSpec extends ObjectBehavior
{
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(TableTypeValidator::class);
    }

    public function it_supports_attribute_type(): void
    {
        $this->forAttributeType()->shouldReturn(TableAttribute::class);
    }

    public function it_does_validate_valid_minimal_record(): void
    {
        $this->validate([])->shouldHaveCount(0);
    }

    public function it_does_validate_valid_record_with_nullables(): void
    {
        $normalizedRecord = [
            'values' => [
                'foo' => [
                    [
                        'channel' => null,
                        'locale'  => null,
                        'data'    => null,
                    ]
                ]
            ]
        ];

        $this->validate($normalizedRecord)->shouldHaveCount(0);
    }

    public function it_does_validate_valid_record(): void
    {
        $normalizedRecord = [
            'values' => [
                'foo' => [
                    [
                        'channel' => 'channel',
                        'locale'  => 'locale',
                        'data'    => '{}',
                    ]
                ]
            ]
        ];

        $this->validate($normalizedRecord)->shouldHaveCount(0);
    }

    public function it_does_validate_invalid_record_without_values(): void
    {
        $normalizedRecord = [
            'values' => [],
        ];

        $this->validate($normalizedRecord)->shouldHaveCount(1);
    }

    public function it_does_validate_invalid_record_without_data(): void
    {
        $normalizedRecord = [
            'values' => [
                'foo' => [
                    [
                        'channel' => null,
                        'locale'  => null,
                    ]
                ]
            ]
        ];

        $this->validate($normalizedRecord)->shouldHaveCount(1);
    }

    public function it_does_validate_invalid_record_without_locale(): void
    {
        $normalizedRecord = [
            'values' => [
                'foo' => [
                    [
                        'channel' => null,
                        'data'  => null,
                    ]
                ]
            ]
        ];

        $this->validate($normalizedRecord)->shouldHaveCount(1);
    }

    public function it_does_validate_invalid_record_without_channel(): void
    {
        $normalizedRecord = [
            'values' => [
                'foo' => [
                    [
                        'locale' => null,
                        'data'  => null,
                    ]
                ]
            ]
        ];

        $this->validate($normalizedRecord)->shouldHaveCount(1);
    }

    public function it_does_validate_invalid_record_with_additional_properties(): void
    {
        $normalizedRecord = [
            'values' => [
                'foo' => [
                    [
                        'channel' => 'channel',
                        'locale'  => 'locale',
                        'data'    => '{}',
                        'extra' => null,
                    ]
                ]
            ]
        ];

        $this->validate($normalizedRecord)->shouldHaveCount(1);
    }
}
