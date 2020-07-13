<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command;

use Akeneo\ReferenceEntity\Application\Attribute\EditAttribute\CommandFactory\AbstractEditAttributeCommand;

class EditTableAttributeCommand extends AbstractEditAttributeCommand
{
    /** @var tablePropertyArray */
    public $tableProperty;

    /**
     * @param string              $identifier
     * @param tablePropertyArray  $tableProperty
     */
    public function __construct(string $identifier, array $tableProperty)
    {
        parent::__construct($identifier);

        $this->tableProperty = $tableProperty;
    }
}
