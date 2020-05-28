<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Record;

use Akeneo\ReferenceEntity\Domain\Model\Attribute\AbstractAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\TableData;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\TableDataHydrator;
use PhpSpec\ObjectBehavior;

class TableDataHydratorSpec extends ObjectBehavior
{
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(TableDataHydrator::class);
    }

    public function it_does_support_attribute(TableAttribute $attribute): void
    {
        $this->supports($attribute)->shouldReturn(true);
    }

    public function it_does_not_support_attribute(AbstractAttribute $attribute): void
    {
        $this->supports($attribute)->shouldReturn(false);
    }

    public function it_hydrates_attribute(TableAttribute $attribute): void
    {
        $expected = TableData::fromString('{}');

        $this->hydrate('{}', $attribute)->shouldBeLike($expected);
    }
}
