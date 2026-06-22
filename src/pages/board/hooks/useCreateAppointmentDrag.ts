import React from 'react';
import {
  MINUTE_HEIGHT,
  SNAP_MINUTES,
  TIME_END,
  TIME_START,
  minutesToTimeString,
  snapMinutesFromTop,
} from '../lib/appointmentBoard';

const MIN_DURATION = SNAP_MINUTES;

export interface CreateColumnContext {
  columnKey: string;
  employeeId?: number;
  targetDate: Date;
}

export interface CreatePreviewState {
  columnKey: string;
  top: number;
  height: number;
  conflict: boolean;
  employeeId?: number;
  targetDate: Date;
  startTime: string;
  endTime: string;
}

interface DragState {
  columnKey: string;
  columnEl: HTMLDivElement;
  employeeId?: number;
  targetDate: Date;
  startTotalMins: number;
  currentEndTotalMins: number;
}

interface UseCreateAppointmentDragOptions {
  onCreated: (params: Omit<CreatePreviewState, 'columnKey' | 'top' | 'height' | 'conflict'>) => void;
  checkConflict: (
    ctx: Pick<CreateColumnContext, 'employeeId' | 'targetDate'>,
    startTotalMins: number,
    endTotalMins: number,
  ) => boolean;
}

export const useCreateAppointmentDrag = ({
  onCreated,
  checkConflict,
}: UseCreateAppointmentDragOptions) => {
  const [preview, setPreview] = React.useState<CreatePreviewState | null>(null);
  const dragRef = React.useRef<DragState | null>(null);
  const onCreatedRef = React.useRef(onCreated);
  const checkConflictRef = React.useRef(checkConflict);

  React.useEffect(() => {
    onCreatedRef.current = onCreated;
    checkConflictRef.current = checkConflict;
  }, [onCreated, checkConflict]);

  const getEndFromMouse = React.useCallback(
    (clientY: number, columnEl: HTMLDivElement, startTotalMins: number): number => {
      const rect = columnEl.getBoundingClientRect();
      const snapped = snapMinutesFromTop(clientY - rect.top) + TIME_START * 60;
      const end = Math.max(snapped, startTotalMins + MIN_DURATION);
      return Math.min(end, TIME_END * 60);
    },
    [],
  );

  const buildPreview = React.useCallback((drag: DragState, endTotalMins: number): CreatePreviewState => {
    const startRel = drag.startTotalMins - TIME_START * 60;
    const endRel = endTotalMins - TIME_START * 60;
    const conflict = checkConflictRef.current(
      { employeeId: drag.employeeId, targetDate: drag.targetDate },
      drag.startTotalMins,
      endTotalMins,
    );

    return {
      columnKey: drag.columnKey,
      top: startRel * MINUTE_HEIGHT,
      height: Math.max((endRel - startRel) * MINUTE_HEIGHT - 4, 32),
      conflict,
      employeeId: drag.employeeId,
      targetDate: drag.targetDate,
      startTime: minutesToTimeString(drag.startTotalMins),
      endTime: minutesToTimeString(endTotalMins),
    };
  }, []);

  const handleMouseMoveRef = React.useRef<(event: MouseEvent) => void>(() => undefined);
  const handleMouseUpRef = React.useRef<() => void>(() => undefined);

  React.useEffect(() => {
    handleMouseMoveRef.current = (event: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const endTotalMins = getEndFromMouse(event.clientY, drag.columnEl, drag.startTotalMins);
      drag.currentEndTotalMins = endTotalMins;
      setPreview(buildPreview(drag, endTotalMins));
    };

    handleMouseUpRef.current = () => {
      window.removeEventListener('mousemove', handleMouseMoveRef.current);
      window.removeEventListener('mouseup', handleMouseUpRef.current);
      document.body.style.removeProperty('user-select');

      const drag = dragRef.current;
      dragRef.current = null;
      setPreview(null);

      if (!drag) return;

      const start = drag.startTotalMins;
      const end = drag.currentEndTotalMins;

      if (end - start < MIN_DURATION) return;
      if (
        checkConflictRef.current(
          { employeeId: drag.employeeId, targetDate: drag.targetDate },
          start,
          end,
        )
      ) {
        return;
      }

      onCreatedRef.current({
        employeeId: drag.employeeId,
        targetDate: drag.targetDate,
        startTime: minutesToTimeString(start),
        endTime: minutesToTimeString(end),
      });
    };
  }, [buildPreview, getEndFromMouse]);

  const handleColumnMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>, ctx: CreateColumnContext) => {
      if (event.button !== 0) return;

      const columnEl = event.currentTarget;
      const rect = columnEl.getBoundingClientRect();
      const startTotalMins = TIME_START * 60 + snapMinutesFromTop(event.clientY - rect.top);

      if (startTotalMins >= TIME_END * 60) return;

      event.preventDefault();

      const endTotalMins = Math.min(startTotalMins + MIN_DURATION, TIME_END * 60);

      dragRef.current = {
        columnKey: ctx.columnKey,
        columnEl,
        employeeId: ctx.employeeId,
        targetDate: ctx.targetDate,
        startTotalMins,
        currentEndTotalMins: endTotalMins,
      };

      setPreview(buildPreview(dragRef.current, endTotalMins));
      document.body.style.userSelect = 'none';

      window.addEventListener('mousemove', handleMouseMoveRef.current);
      window.addEventListener('mouseup', handleMouseUpRef.current);
    },
    [buildPreview],
  );

  return { preview, handleColumnMouseDown };
};
