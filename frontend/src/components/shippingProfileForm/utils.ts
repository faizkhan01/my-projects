import {
  createShippingProfileArea,
  deleteShippingProfileArea,
} from '@/services/API/shipping-profiles';
import { Country } from '@/types/countries';
import {
  ShippingProfileArea,
  ShippingProfileAreaWithoutId,
  ShippingProfileFormValues,
} from '@/types/shippingProfiles';

type FormValues = ShippingProfileFormValues;

export const getConfirmedAreas = (
  areas: FormValues['areas'],
): FormValues['areas'] => {
  return areas.filter((a) => {
    return a?.id || a?.confirmed;
  });
};

export const getTableConfirmedAreas = (
  areas: FormValues['areas'],
  countries: Country[],
) => {
  let tableConfirmedAreas: ShippingProfileAreaWithoutId[] = [];
  const confirmedAreas = getConfirmedAreas(areas);

  for (const area of confirmedAreas) {
    let areaCountries: Country[] | null | undefined = area?.countries;

    if (!areaCountries?.length) {
      areaCountries = area.everyWhere
        ? null
        : countries?.filter(
            (c) =>
              area.countryIds?.some((id) => id === c.id) ||
              area.countries?.some((ac) => ac.id === c.id),
          );
    }

    if (areaCountries) {
      tableConfirmedAreas = [
        ...tableConfirmedAreas,
        {
          ...area,
          countries: areaCountries,
        },
      ];
    } else if (area.everyWhere) {
      tableConfirmedAreas = [...tableConfirmedAreas, area];
    }
  }

  return tableConfirmedAreas;
};

export const handleUpdateAreas = async (
  shippingProfileId: number,
  newAreas: FormValues['areas'],
  oldAreas: ShippingProfileArea[],
): Promise<boolean> => {
  if (
    newAreas.length !== oldAreas.length ||
    newAreas.some((a) => a.confirmed)
  ) {
    const areasToDelete = oldAreas.filter((area) =>
      newAreas.every((a) => a.id !== area.id),
    );

    newAreas = newAreas.filter((area) => area.confirmed);

    if (areasToDelete.length) {
      for (const area of areasToDelete) {
        await deleteShippingProfileArea(shippingProfileId, area.id);
      }
    }

    if (newAreas.length) {
      for (const area of newAreas) {
        await createShippingProfileArea(shippingProfileId, {
          carrier: area.carrier,
          everyWhere: area.everyWhere,
          maxDays: area.maxDays,
          minDays: area.minDays,
          price: area.price,
          countryIds: area?.countryIds?.filter((i) => i > 0),
        });
      }
    }

    return true;
  }

  return false;
};
