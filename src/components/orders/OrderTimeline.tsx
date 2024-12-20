import React from 'react';
import { motion } from 'framer-motion';
import { OrderStatus } from '../../types';
import { formatFirestoreTimestamp } from '../../utils/date';

interface OrderTimelineProps {
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export function OrderTimeline({ status, createdAt, updatedAt }: OrderTimelineProps) {
  const statuses: OrderStatus[] = ['pending', 'preparing', 'ready', 'delivered'];
  const currentIndex = statuses.indexOf(status);

  return (
    <div className="mt-4">
      <div className="relative">
        <div className="absolute left-0 top-2.5 h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
        <div className="relative flex justify-between">
          {statuses.map((s, index) => {
            const isCompleted = index <= currentIndex;
            const isActive = index === currentIndex;
            
            return (
              <div key={s} className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    backgroundColor: isCompleted ? '#3B82F6' : '#E5E7EB'
                  }}
                  className={`w-5 h-5 rounded-full relative z-10 ${
                    isActive ? 'ring-4 ring-blue-100 dark:ring-blue-900' : ''
                  }`}
                />
                <span className="mt-2 text-sm capitalize">
                  {s}
                </span>
                {index === 0 && (
                  <span className="text-xs text-gray-500 mt-1">
                    {formatFirestoreTimestamp(createdAt)}
                  </span>
                )}
                {isActive && index > 0 && (
                  <span className="text-xs text-gray-500 mt-1">
                    {formatFirestoreTimestamp(updatedAt)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}