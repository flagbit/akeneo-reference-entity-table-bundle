// Common akeneo ts instances for the usage in tests
import Locale, {ConcreteLocale} from "akeneoreferenceentity/domain/model/locale";
import { RightsType } from "../../../src/Resources/public/reference-entity/attribute/table/view";

export function createLocales(): Locale[] {
    return [
        new ConcreteLocale('de_DE', 'de label', 'region1', 'de'),
        new ConcreteLocale('en_US', 'us label', 'region2', 'en'),
    ];
}

export const accessRightsTrue: RightsType = {
    locale: {
        edit: true
    },
    attribute: {
        create: true,
        edit: true,
        delete: true,
    }
}

export const accessRightsFalse: RightsType = {
    locale: {
        edit: false
    },
    attribute: {
        create: false,
        edit: false,
        delete: false,
    }
}

