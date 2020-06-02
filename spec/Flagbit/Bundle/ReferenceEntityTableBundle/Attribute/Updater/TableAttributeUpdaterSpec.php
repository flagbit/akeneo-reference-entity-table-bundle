<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Updater;

use Akeneo\ReferenceEntity\Application\Attribute\EditAttribute\CommandFactory\AbstractEditAttributeCommand;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AbstractAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\EditTableAttributeCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Updater\TableAttributeUpdater;
use Flagbit\Bundle\ReferenceEntityTableBundle\Property\TableProperty;
use PhpSpec\ObjectBehavior;
use RuntimeException;

class TableAttributeUpdaterSpec extends ObjectBehavior
{
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(TableAttributeUpdater::class);
    }

    public function it_does_support_attribute(TableAttribute $attribute, EditTableAttributeCommand $command): void
    {
        $this->supports($attribute, $command)->shouldReturn(true);
    }

    public function it_does_not_support_attribute(AbstractAttribute $attribute, AbstractEditAttributeCommand $command): void
    {
        $this->supports($attribute, $command)->shouldReturn(false);
    }

    public function it_does_update_attribute(TableAttribute $attribute, EditTableAttributeCommand $command): void
    {
        $command->tableProperty = 'table_property';

        $attribute->setTableProperty(TableProperty::fromString('table_property'));

        $this->__invoke($attribute, $command)->shouldBeAnInstanceOf(TableAttribute::class);
    }

    public function it_does_not_update_with_invalid_command(AbstractAttribute $attribute, AbstractEditAttributeCommand $command): void
    {
        $this->shouldThrow(RuntimeException::class)->during('__invoke', [$attribute, $command]);
    }
}
