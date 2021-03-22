<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Record\Command\CommandFactory;

use Akeneo\ReferenceEntity\Application\Record\EditRecord\CommandFactory\AbstractEditValueCommand;
use Akeneo\ReferenceEntity\Application\Record\EditRecord\CommandFactory\EditValueCommandFactoryInterface;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AbstractAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\Command\EditTableValueCommand;

class EditTableCommandFactory implements EditValueCommandFactoryInterface
{
    /**
     * @param AbstractAttribute                                                                 $attribute
     * @param array{'locale': string|null, 'channel': string|null, 'data': array<mixed>|string} $normalizedValue
     *
     * @return bool
     */
    public function supports(AbstractAttribute $attribute, array $normalizedValue): bool
    {
        return
            $attribute instanceof TableAttribute &&
            ((is_array($normalizedValue['data']) &&
            0 !== count($normalizedValue['data'])) ||
            is_string($normalizedValue['data']));
    }

    /**
     * @param TableAttribute                                                                    $attribute
     * @param array{'locale': string|null, 'channel': string|null, 'data': array<mixed>|string} $normalizedValue
     *
     * @return AbstractEditValueCommand
     */
    public function create(AbstractAttribute $attribute, array $normalizedValue): AbstractEditValueCommand
    {
        if (is_string($normalizedValue['data'])) {
            $normalizedValue['data'] = json_decode($normalizedValue['data'], true);
        }

        return new EditTableValueCommand(
            $attribute,
            $normalizedValue['channel'],
            $normalizedValue['locale'],
            $normalizedValue['data']
        );
    }
}
