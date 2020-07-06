<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Attribute;

use Akeneo\ReferenceEntity\Application\Attribute\CreateAttribute\AbstractCreateAttributeCommand;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeIdentifier;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeOrder;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\CreateTableAttributeCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttributeFactory;
use PhpSpec\ObjectBehavior;
use RuntimeException;

class TableAttributeFactorySpec extends ObjectBehavior
{
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(TableAttributeFactory::class);
    }

    public function it_does_not_support_create_command(AbstractCreateAttributeCommand $command): void
    {
        $this->supports($command)->shouldReturn(false);
    }

    public function it_does_support_create_command(CreateTableAttributeCommand $command): void
    {
        $this->supports($command)->shouldReturn(true);
    }

    public function it_throws_exception_on_create(
        AbstractCreateAttributeCommand $command,
        AttributeIdentifier $identifier,
        AttributeOrder $order
    ): void {
        $this->shouldThrow(RuntimeException::class)->duringCreate($command, $identifier, $order);
    }

    public function it_creates_table_attribute(
        CreateTableAttributeCommand $command,
        AttributeIdentifier $identifier,
        AttributeOrder $order
    ): void {
        $command->referenceEntityIdentifier = 'referenceEntityIdentifier';
        $command->code = 'code';
        $command->labels = ['de_DE' => 'fuu', 'en_US' => 'foo'];
        $command->isRequired = false;
        $command->valuePerChannel = false;
        $command->valuePerLocale = false;
        $command->tableProperty = [];

        $this->create($command, $identifier, $order)->shouldReturnAnInstanceOf(TableAttribute::class);
    }
}
