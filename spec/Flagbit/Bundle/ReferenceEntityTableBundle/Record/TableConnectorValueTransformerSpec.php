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
}
