function isAddonCompatible(addon, serviceId, categoryId) {
  if (serviceId && addon.compatibleServiceIds?.length) {
    return addon.compatibleServiceIds.includes(serviceId);
  }

  return addon.compatibleCategoryIds?.includes(categoryId) ?? false;
}

export default isAddonCompatible;
