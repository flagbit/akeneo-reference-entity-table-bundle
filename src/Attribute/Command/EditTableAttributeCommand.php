<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command;

use Akeneo\ReferenceEntity\Application\Attribute\EditAttribute\CommandFactory\AbstractEditAttributeCommand;

class EditTableAttributeCommand extends AbstractEditAttributeCommand
{
    /** @var string */
    public $tableProperty;

    public function __construct(string $identifier, string $tableProperty)
    {
        parent::__construct($identifier);

        $this->tableProperty = $tableProperty;
    }
}
