import { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchDebateById } from '../api/debatesApi';

export const useDebateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'timeline' | 'facts' | 'fallacies' | 'metrics' | 'audience'>('timeline');
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);

  const {
    data: debate,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['debate', id],
    queryFn: () => (id ? fetchDebateById(id) : null),
    enabled: Boolean(id)
  });

  const handleSeek = (seconds: number) => {
    setCurrentTimestamp(seconds);
  };

  return {
    debate,
    id,
    isLoading,
    isError,
    activeTab,
    setActiveTab,
    currentTimestamp,
    handleSeek,
    refetch
  };
};
