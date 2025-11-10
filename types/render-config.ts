export type PresentationItem<T> = {
  label: string;
  color: string;
  filter: (item: T) => boolean;
  // optional UI helper classes used by event badges, etc.
  eventBadgeClasses?: string;
  icon?: React.ElementType;
};

export type PresentationConfig<T> = Record<string, PresentationItem<T>>;
