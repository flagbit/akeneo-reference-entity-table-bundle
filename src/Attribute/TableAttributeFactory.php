<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Attribute;

use Akeneo\ReferenceEntity\Application\Attribute\CreateAttribute\AbstractCreateAttributeCommand;
use Akeneo\ReferenceEntity\Application\Attribute\CreateAttribute\AttributeFactory\AttributeFactoryInterface;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AbstractAttribute;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeCode;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeIdentifier;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeIsRequired;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeOrder;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeValuePerChannel;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeValuePerLocale;
use Akeneo\ReferenceEntity\Domain\Model\LabelCollection;
use Akeneo\ReferenceEntity\Domain\Model\ReferenceEntity\ReferenceEntityIdentifier;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\CreateTableAttributeCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Property\TableProperty;

class TableAttributeFactory implements AttributeFactoryInterface
{
    public function supports(AbstractCreateAttributeCommand $command): bool
    {
        return $command instanceof CreateTableAttributeCommand;
    }

    public function create(
        AbstractCreateAttributeCommand $command,
        AttributeIdentifier $identifier,
        AttributeOrder $order
    ): AbstractAttribute {
        if (! $this->supports($command)) {
            throw new \RuntimeException(
                sprintf(
                    'Expected command of type "%s", "%s" given',
                    CreateTableAttributeCommand::class,
                    get_class($command)
                )
            );
        }
        /** @var CreateTableAttributeCommand $command */
        return TableAttribute::create(
            $identifier,
            ReferenceEntityIdentifier::fromString($command->referenceEntityIdentifier),
            AttributeCode::fromString($command->code),
            LabelCollection::fromArray($command->labels),
            $order,
            AttributeIsRequired::fromBoolean($command->isRequired),
            AttributeValuePerChannel::fromBoolean($command->valuePerChannel),
            AttributeValuePerLocale::fromBoolean($command->valuePerLocale),
            TableProperty::fromArray($command->tableProperty)
        );
    }
}
