<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\CommandFactory;

use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\CommandFactory\EditTableAttributeCommandFactory;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\EditTableAttributeCommand;
use PhpSpec\ObjectBehavior;

class EditTableAttributeCommandFactorySpec extends ObjectBehavior
{
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(EditTableAttributeCommandFactory::class);
    }

    public function it_does_support_command(): void
    {
        $this->supports(['table_property' => [], 'identifier' => 'identifier'])->shouldReturn(true);
    }

    public function it_does_not_support_command(): void
    {
        $this->supports([])->shouldReturn(false);
    }

    public function it_does_not_support_command_on_wrong_property_type(): void
    {
        $this->supports(['table_property' => 'string', 'identifier' => 'identifier'])->shouldReturn(false);
    }

    public function it_does_create_command(): void
    {
        $command = new EditTableAttributeCommand('identifier', []);

        $this->create(['table_property' => [], 'identifier' => 'identifier'])->shouldBeLike($command);
    }

    public function it_throws_exception_on_different_command(): void
    {
        $this->shouldThrow(\RuntimeException::class)->during('create', [['foo' => true, 'identifier' => 'identifier']]);
    }
}
