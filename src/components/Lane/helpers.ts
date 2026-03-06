export function laneTitleWithMaxItems(title: string, maxItems?: number) {
    if (!maxItems) return title;
    return `${title} (${maxItems})`;
}
