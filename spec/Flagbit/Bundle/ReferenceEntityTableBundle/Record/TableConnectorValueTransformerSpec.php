<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Record;

use Akeneo\ReferenceEntity\Domain\Model\Attribute\AbstractAttribute;
use Exception;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\TableConnectorValueTransformer;
use PhpSpec\ObjectBehavior;

class TableConnectorValueTransformerSpec extends ObjectBehavior
{
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(TableConnectorValueTransformer::class);
    }

    public function it_does_support_table_attribute(TableAttribute $attribute): void
    {
        $this->supports($attribute)->shouldReturn(true);
    }

    public function it_does_not_support_other_attributes(AbstractAttribute $attribute): void
    {
        $this->supports($attribute)->shouldReturn(false);
    }

    public function it_does_transform_record(TableAttribute $attribute): void
    {
        $attribute->normalize()->willReturn([
            'table_property' => [
                ['code' => 'test3'],
                ['code' => 'test4'],
            ]
        ]);
        $normalized = [
            'locale' => null,
            'channel' => null,
            'data' => [
                [
                    'test3' => '1',
                    'test4' => 'lol1',
                ],
                [
                    'test3' => '2',
                    'test4' => 'rofl',
                ]
            ],
        ];

        $this->transform($normalized, $attribute)->shouldReturn($normalized);
    }

    public function it_does_not_transform_other_records(AbstractAttribute $attribute): void
    {
        $attribute->normalize()->willReturn([]);
        $normalized = [
            'locale' => null,
            'channel' => null,
            'data' => [
                [
                    'test3' => '1',
                    'test4' => 'lol1',
                ],
                [
                    'test3' => '2',
                    'test4' => 'rofl',
                ]
            ],
        ];

        $this->shouldThrow(Exception::class)->during('transform', [$normalized, $attribute]);
    }

    public function it_does_filter_unknown_columns(TableAttribute $attribute): void
    {
        $attribute->normalize()->willReturn([
            'table_property' => [
                ['code' => 'test2'],
                ['code' => 'test4'],
            ]
        ]);
        $normalized = [
            'locale' => null,
            'channel' => null,
            'data' => [
                [
                    'test1' => '1',
                    'test2' => '2',
                    'test3' => '3',
                    'test4' => '4',
                ],
                [
                    'test1' => '5',
                    'test2' => '6',
                    'test3' => '7',
                    'test4' => '8',
                ],
            ],
        ];

        $expected = [
            'locale' => null,
            'channel' => null,
            'data' => [
                [
                    'test2' => '2',
                    'test4' => '4',
                ],
                [
                    'test2' => '6',
                    'test4' => '8',
                ],
            ],
        ];

        $this->transform($normalized, $attribute)->shouldReturn($expected);
    }

    public function it_can_handle_missing_value_of_new_column(TableAttribute $attribute): void
    {
        $attribute->normalize()->willReturn([
            'table_property' => [
                ['code' => 'test2'],
                ['code' => 'test4'],
            ]
        ]);
        $normalized = [
            'locale' => null,
            'channel' => null,
            'data' => [
                [
                    'test1' => '1',
                    'test3' => '3',
                    'test4' => '4',
                ],
                [
                    'test1' => '5',
                    'test3' => '7',
                    'test4' => '8',
                ],
            ],
        ];

        $expected = [
            'locale' => null,
            'channel' => null,
            'data' => [
                [
                    'test4' => '4',
                ],
                [
                    'test4' => '8',
                ],
            ],
        ];

        $this->transform($normalized, $attribute)->shouldReturn($expected);
    }
}
