<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\JsonSchema;

use Akeneo\ReferenceEntity\Infrastructure\Connector\Api\Attribute\JsonSchema\Create\AttributeValidatorInterface;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use JsonSchema\Validator;

final class TableAttributeCreationValidator implements AttributeValidatorInterface
{
    /**
     * @param array<mixed> $normalizedAttribute
     *
     * @return array{'property': string, 'message': string}
     */
    public function validate(array $normalizedAttribute): array
    {
        $record = Validator::arrayToObjectRecursive($normalizedAttribute);
        $validator = new Validator();
        $validator->validate($record, $this->getJsonSchema());

        return $validator->getErrors();
    }

    /**
     * @return array<string>
     */
    public function forAttributeTypes(): array
    {
        return [TableAttribute::ATTRIBUTE_TYPE_NAME];
    }

    /**
     * @return array<mixed>
     */
    private function getJsonSchema(): array
    {
        return [
            'type' => 'object',
            'required' => ['code', 'type', 'value_per_locale', 'value_per_channel'],
            'properties' => [
                'code' => [
                    'type' => ['string'],
                ],
                'type' => [
                    'type' => ['string'],
                ],
                'labels' => [
                    'type' => 'object',
                    'patternProperties' => [
                        '.+' => ['type' => 'string'],
                    ],
                ],
                'value_per_locale' => [
                    'type' => ['boolean'],
                ],
                'value_per_channel' => [
                    'type' => ['boolean'],
                ],
                'is_required_for_completeness' => [
                    'type' => ['boolean'],
                ],
                'table_property' => [
                    'type' => 'array',
                    'minItems' => 0,
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'code' => [
                                'type' => ['string'],
                            ],
                            'labels' => [
                                'type' => 'object',
                                'patternProperties' => [
                                    '.+' => ['type' => 'string'],
                                ],
                            ],
                            'type' => [
                                'type' => ['string'],
                                'enum' => ['text', 'number', 'simple_select', 'simple_select_localized'],
                            ],
                            'validations' => [
                                'minItems' => 0,
                                'maxItems' => 0, // Not implemented yet. Prevent users to add nonsense-data
                                'type' => 'array',
                                'items' => [
                                    'type' => 'object',
                                ],
                            ],
                            'config' => [
                                'type' => ['object', 'array'],
                            ]
                        ],
                    ],
                ],
            ],
            'additionalProperties' => false,
        ];
    }
}
