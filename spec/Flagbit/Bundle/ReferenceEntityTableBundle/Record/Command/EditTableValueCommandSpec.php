<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Record\Command;

use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\Command\EditTableValueCommand;
use PhpSpec\ObjectBehavior;

class EditTableValueCommandSpec extends ObjectBehavior
{
    public function it_is_initializable(TableAttribute $attribute): void
    {
        $this->beConstructedWith($attribute, 'channel', 'locale', ['data']);
        $this->shouldHaveType(EditTableValueCommand::class);
    }

    public function it_contains_table_data(TableAttribute $attribute): void
    {
        $this->beConstructedWith($attribute, 'channel', 'locale', ['data']);
        $this->tableValue->shouldBe(['data']);
        $this->channel->shouldBe('channel');
        $this->locale->shouldBe('locale');
        $this->attribute->shouldBe($attribute);
    }

    public function it_contains_nullable_table_data(TableAttribute $attribute): void
    {
        $this->beConstructedWith($attribute, null, null, []);
        $this->channel->shouldBe(null);
        $this->locale->shouldBe(null);
    }
}
