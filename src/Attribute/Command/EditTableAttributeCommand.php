<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command;

use Akeneo\ReferenceEntity\Application\Attribute\EditAttribute\CommandFactory\AbstractEditAttributeCommand;

class EditTableAttributeCommand extends AbstractEditAttributeCommand
{
    /** @var array */
    public $tableProperty;

    public function __construct(string $identifier, array $tableProperty)
    {
        parent::__construct($identifier);

        $this->tableProperty = $tableProperty;
    }
}
