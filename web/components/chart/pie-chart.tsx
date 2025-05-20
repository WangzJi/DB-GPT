import { ChatContext } from '@/app/chat-context';
import { ChartData } from '@/types/chat';
import { Chart } from '@berryv/g2-react';
import { groupBy } from 'lodash';
import { useContext, useMemo } from 'react';

export default function PieChart({ chart }: { key: string; chart: ChartData }) {
  const { mode } = useContext(ChatContext);

  // Group data by name and aggregate values
  const pieData = useMemo(() => {
    if (!chart.values || !Array.isArray(chart.values)) {
      return [];
    }
    // Group by name field
    const groupedData = groupBy(chart.values, 'name');
    return Object.keys(groupedData).map(name => {
      const sum = groupedData[name].reduce((acc, item) => {
        const value = Number(item.value);
        return acc + (isNaN(value) ? 0 : value);
      }, 0);
      return {
        name: name,
        value: sum,
      };
    });
  }, [chart.values]);

  if (!pieData.length) {
    return null;
  }

  return (
    <div className='flex-1 min-w-0 p-4 bg-white dark:bg-theme-dark-container rounded'>
      <div className='h-full'>
        <div className='mb-2'>{chart.chart_name}</div>
        <div className='opacity-80 text-sm mb-2'>{chart.chart_desc}</div>
        <div className='h-[300px]'>
          <Chart
            style={{ height: '100%' }}
            options={{
              autoFit: true,
              theme: mode,
              type: 'interval',
              coordinate: { type: 'theta' },
              data: pieData,
              encode: {
                y: 'value',
                color: 'name',
              },
              scale: {
                y: { nice: true },
              },
              legend: {
                color: { position: 'right' },
              },
              tooltip: {
                items: [
                  { field: 'name', name: chart.column_name?.[0] || 'Category' },
                  { field: 'value', name: chart.column_name?.[1] || 'Value' },
                ],
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
