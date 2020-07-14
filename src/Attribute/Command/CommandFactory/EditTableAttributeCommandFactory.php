<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\CommandFactory;

use Akeneo\ReferenceEntity\Application\Attribute\EditAttribute\CommandFactory\EditAttributeCommandFactoryInterface;
use Akeneo\ReferenceEntity\Application\Attribute\EditAttribute\CommandFactory\AbstractEditAttributeCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\EditTableAttributeCommand;

class EditTableAttributeCommandFactory implements EditAttributeCommandFactoryInterface
{
    /**
     * @param array<mixed> $normalizedCommand
     *
     * @return bool
     */
    public function supports(array $normalizedCommand): bool
    {
        return array_key_exists('table_property', $normalizedCommand)
            && array_key_exists('identifier', $normalizedCommand)
            && is_array($normalizedCommand['table_property']);
    }

    /**
     * @param array<mixed> $normalizedCommand
     *
     * @return AbstractEditAttributeCommand
     */
    public function create(array $normalizedCommand): AbstractEditAttributeCommand
    {
        if (!$this->supports($normalizedCommand)) {
            throw new \RuntimeException('Impossible to create an edit table property command.');
        }

        return new EditTableAttributeCommand(
            $normalizedCommand['identifier'],
            $normalizedCommand['table_property']
        );
    }
}
