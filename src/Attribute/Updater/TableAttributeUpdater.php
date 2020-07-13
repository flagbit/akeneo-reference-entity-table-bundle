<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Updater;

use Akeneo\ReferenceEntity\Application\Attribute\EditAttribute\AttributeUpdater\AttributeUpdaterInterface;
use Akeneo\ReferenceEntity\Application\Attribute\EditAttribute\CommandFactory\AbstractEditAttributeCommand;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AbstractAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\EditTableAttributeCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Property\TableProperty;

class TableAttributeUpdater implements AttributeUpdaterInterface
{
    public function supports(AbstractAttribute $attribute, AbstractEditAttributeCommand $command): bool
    {
        return $command instanceof EditTableAttributeCommand && $attribute instanceof TableAttribute;
    }

    /**
     * @param TableAttribute               $attribute
     * @param AbstractEditAttributeCommand $command
     * @return AbstractAttribute
     */
    public function __invoke(AbstractAttribute $attribute, AbstractEditAttributeCommand $command): AbstractAttribute
    {
        if (! $command instanceof EditTableAttributeCommand) {
            throw new \RuntimeException(
                sprintf(
                    'Expected command of type "%s", "%s" given',
                    EditTableAttributeCommand::class,
                    get_class($command)
                )
            );
        }

        $attribute->setTableProperty(TableProperty::fromArray($command->tableProperty));

        return $attribute;
    }
}
