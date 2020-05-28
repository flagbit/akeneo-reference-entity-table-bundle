<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Record;

use Flagbit\Bundle\ReferenceEntityTableBundle\Record\TableData;
use PhpSpec\ObjectBehavior;

class TableDataSpec extends ObjectBehavior
{
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(TableData::class);
    }

    public function it_normalizes_correctly_when_constructed_from_string(): void
    {
        $this->beConstructedThrough('fromString', ['foo']);
        $this->normalize()->shouldReturn('foo');
    }

    public function it_normalizes_correctly_when_constructed_from_normalized(): void
    {
        $this->beConstructedThrough('createFromNormalize', ['foo']);
        $this->normalize()->shouldReturn('foo');
    }
}
