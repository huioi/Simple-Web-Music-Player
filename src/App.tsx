import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import musicList from './musicList';

// 自定义去抖动函数
function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [playedSongs, setPlayedSongs] = useState<number[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousVolumeRef = useRef(volume);

  // 播放指定索引的歌曲
  const playSong = (index: number) => {
    if (audioRef.current) {
      audioRef.current.src = musicList[index];
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Playback error:', err);
          setError('播放失败，请重试。');
        });
    }
  };

  // 随机播放未播放过的歌曲
  const playRandomSong = useCallback(() => {
    const playedSet = new Set(playedSongs);
    const remainingIndices = musicList.map((_, idx) => idx).filter(idx => !playedSet.has(idx));

    if (remainingIndices.length === 0) {
      // 所有歌曲都已播放
      setError('歌单已播放结束。');
      return;
    }

    const randomIndex = remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
    const newPlayedSongs = [...playedSongs.slice(0, currentSongIndex + 1), randomIndex];
    setPlayedSongs(newPlayedSongs);
    setCurrentSongIndex(currentSongIndex + 1);
    playSong(randomIndex);
    setError(null);
  }, [playedSongs, currentSongIndex]);

  // 播放下一首歌曲
  const playNextSong = useCallback(() => {
    if (currentSongIndex < playedSongs.length - 1) {
      // 有历史歌曲可供前进
      const nextIndex = currentSongIndex + 1;
      setCurrentSongIndex(nextIndex);
      playSong(playedSongs[nextIndex]);
      setError(null);
    } else {
      // 播放新的随机歌曲
      playRandomSong();
    }
  }, [currentSongIndex, playedSongs, playRandomSong]);

  // 切换播放/暂停状态
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (currentSongIndex === -1) {
        playRandomSong();
      } else {
        audioRef.current
          ?.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.error('Playback error:', err);
            setError('播放失败，请重试。');
          });
      }
    }
  }, [isPlaying, currentSongIndex, playRandomSong]);

  // 键盘事件监听（空格按键控制切换播放/暂停状态）
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlayPause]);

  // 处理歌曲结束事件
  const handleSongEnd = useCallback(() => {
    playNextSong();
  }, [playNextSong]);

  // 添加歌曲结束事件监听
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleSongEnd);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleSongEnd);
      }
    };
  }, [handleSongEnd]);

  // 播放上一首歌曲
  const playPreviousSong = () => {
    if (currentSongIndex > 0) {
      const prevIndex = currentSongIndex - 1;
      setCurrentSongIndex(prevIndex);
      playSong(playedSongs[prevIndex]);
      setError(null);
    }
  };

  // 防抖处理音量变化
  const debouncedHandleVolumeChange = useCallback(
    debounce((newVolume: number) => {
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    }, 200),
    []
  );

  // 处理音量变化
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(false);
    debouncedHandleVolumeChange(newVolume);
  };

  // 切换静音状态
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolumeRef.current);
      if (audioRef.current) {
        audioRef.current.volume = previousVolumeRef.current;
      }
    } else {
      setIsMuted(true);
      previousVolumeRef.current = volume;
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-800 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-6xl font-bold mb-8 text-shadow-neon neon-blink">1-1 Radio</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white bg-opacity-20 p-8 rounded-lg backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-center space-x-4 mb-6">
        {/* 上一首按钮 */}
        <button
          onClick={playPreviousSong}
          disabled={currentSongIndex <= 0}
          className={`text-white hover:text-pink-300 transition-colors ${currentSongIndex <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <SkipBack size={32} />
        </button>

        {/* 播放/暂停按钮 */}
        <button 
          onClick={togglePlayPause} 
          className="bg-white text-purple-800 rounded-full p-4 hover:bg-pink-200 transition-colors flex items-center justify-center w-16 h-16"
        >
          {isPlaying ? <Pause size={32} /> : <div className='relative left-0.5'><Play size={32} /></div>}
        </button>

        {/* 下一首按钮 */}
        <button
          onClick={playNextSong}
          disabled={currentSongIndex >= playedSongs.length - 1 && playedSongs.length >= musicList.length}
          className={`text-white hover:text-pink-300 transition-colors ${(currentSongIndex >= playedSongs.length - 1 && playedSongs.length >= musicList.length) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <SkipForward size={32} />
        </button>
      </div>
      
        {currentSongIndex !== -1 && playedSongs.length > 0 && (
          <p className="text-xl mb-4">
            Currently Playing: {musicList[playedSongs[currentSongIndex]].split('/').pop()?.replace('.mp3', '')}
          </p>
        )}
        <div className="flex items-center space-x-2">
          <button onClick={toggleMute} className="text-white hover:text-pink-300 transition-colors">
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full"
          />
        </div>
      </div>
      <audio ref={audioRef} />
      <p className="text-center mt-16 mb-4">
        <a href="https://www.jojojo.fun" target="_blank" rel="noopener noreferrer">
          Work, Read, Meditate, Relax~~~
        </a>
      </p>
    </div>
  );
}

export default App;