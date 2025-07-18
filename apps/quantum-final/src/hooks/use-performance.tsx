
import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  fps: number
  loadTime: number
  renderTime: number
  memoryUsage?: number
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0
  })

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
        }))
        
        frameCount = 0
        lastTime = currentTime
      }
      
      animationId = requestAnimationFrame(measureFPS)
    }

    // Measure initial load time
    const loadTime = performance.timing 
      ? performance.timing.loadEventEnd - performance.timing.navigationStart 
      : 0

    setMetrics(prev => ({ ...prev, loadTime }))

    // Start FPS monitoring
    measureFPS()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return metrics
}
