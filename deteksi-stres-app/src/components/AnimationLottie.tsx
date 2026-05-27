"use client"

import Lottie from "lottie-react"
import animationData from "@/lotties/stress-animation.json"

export default function AnimationLottie() {
  return (
    <div className="w-[350px]">
      <Lottie animationData={animationData} loop />
    </div>
  )
}