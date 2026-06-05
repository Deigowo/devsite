"use client"

import dynamic from "next/dynamic"
import { useState, useEffect, useRef } from "react"
import { LoadingSplash } from "@/components/LoadingSplash"
import { Hero } from "@/components/Hero"
import { ScrollSections } from "@/components/ScrollSections"
import { RadioManager } from "@/lib/RadioManager"

const OriginalScene = dynamic(
    () => import("@/components/OriginalScene").then((m) => ({ default: m.OriginalScene })),
    {ssr: false}
)