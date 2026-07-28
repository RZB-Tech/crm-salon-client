import React from 'react';

/**
 * Сбрасывает локальное состояние при «открытии» — без `useEffect`.
 *
 * Заменяет паттерн `useEffect(() => { if (trigger) reset(); }, [trigger])`,
 * который вызывает каскадные ре-рендеры (правило `react-hooks/set-state-in-effect`).
 * Здесь сброс выполняется на этапе рендера — канонический приём React
 * «сохранение информации о предыдущем рендере».
 *
 * @param trigger значение, изменение которого означает новое открытие:
 *   `boolean opened` (модалка) или сама сущность (форма перечитывается при смене записи).
 * @param reset колбэк со всеми `setState` для инициализации состояния.
 */
/** Маркер «ещё не инициализировано» — чтобы truthy-триггер срабатывал и на первом рендере. */
const UNINITIALIZED = Symbol('uninitialized');

export const useResetOnOpen = (trigger: unknown, reset: () => void): void => {
  const [prev, setPrev] = React.useState<unknown>(UNINITIALIZED);

  if (trigger !== prev) {
    setPrev(trigger);
    if (trigger) reset();
  }
};
