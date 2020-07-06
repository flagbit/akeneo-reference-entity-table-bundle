<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Property;

use Flagbit\Bundle\ReferenceEntityTableBundle\Property\TableProperty;
use PhpSpec\ObjectBehavior;

class TablePropertySpec extends ObjectBehavior
{
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(TableProperty::class);
    }

    public function it_normalizes_property(): void
    {
        $this->beConstructedThrough('fromArray', [['table_property']]);

        $this->normalize()->shouldReturn(['table_property']);
    }
}
