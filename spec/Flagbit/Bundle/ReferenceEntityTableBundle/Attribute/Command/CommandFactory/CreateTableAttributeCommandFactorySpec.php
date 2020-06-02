<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\CommandFactory;

use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\CommandFactory\CreateTableAttributeCommandFactory;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\CreateTableAttributeCommand;
use PhpSpec\ObjectBehavior;

class CreateTableAttributeCommandFactorySpec extends ObjectBehavior
{
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(CreateTableAttributeCommandFactory::class);
    }

    public function it_does_support_attribute_type(): void
    {
        $this->supports(['type' => 'flagbit_table'])->shouldReturn(true);
    }

    public function it_does_not_support_attribute_type(): void
    {
        $this->supports(['type' => 'flagbit_table1'])->shouldReturn(false);
    }

    public function it_creates_command(): void
    {
        $normalizedCommand = [
            'reference_entity_identifier' => 'id',
            'code' => 'code',
            'labels' => ['de_DE' => 'fuu', 'en_US' => 'foo'],
            'is_required' => false,
            'value_per_channel' => false,
            'value_per_locale' => false,
            'table_property' => 'table_property',
        ];

        $expected = new CreateTableAttributeCommand(...array_values($normalizedCommand));
        
        $this->create($normalizedCommand)->shouldBeLike($expected);
    }

    public function it_creates_command_with_minimal_elements(): void
    {
        $normalizedCommand = [
            'reference_entity_identifier' => 'id',
            'code' => 'code',
            'labels' => [],
            'is_required' => false,
            'value_per_channel' => false,
            'value_per_locale' => false,
            'table_property' => ''
        ];

        $expected = new CreateTableAttributeCommand(...array_values($normalizedCommand));

        unset($normalizedCommand['labels'], $normalizedCommand['is_required'], $normalizedCommand['table_property']);

        $this->create($normalizedCommand)->shouldBeLike($expected);
    }
}
