import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchDebateById } from '../api/debatesApi';
import { recordDebateView } from '@/features/newsletter/utils/debateViewTracker';

export const useDebateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'timeline' | 'facts' | 'fallacies' | 'metrics' | 'audience'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      return 'facts';
    }
    return 'timeline';
  });
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

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

  useEffect(() => {
    if (debate?.id) {
      recordDebateView({
        id: debate.id,
        title: debate.title || `Debate ${debate.speakers?.map((s) => s.name).join(' vs ') || ''}`
      });
    }
  }, [debate?.id, debate?.title, debate?.speakers]);

  const handleSeek = (seconds: number) => {
    setCurrentTimestamp(seconds);
    setIsAutoPlay(true);

    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [seconds, true]
          }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'playVideo',
            args: []
          }),
          '*'
        );
      } catch {
        // Fallback handled by iframe src
      }
    }
  };

  return {
    debate,
    id,
    isLoading,
    isError,
    activeTab,
    setActiveTab,
    currentTimestamp,
    isAutoPlay,
    iframeRef,
    handleSeek,
    refetch
  };
};

