"use client"
import React from 'react'
import { useSidebarStore } from '@/src/stores/sidebar-store'
import CommentList from './comment-list'

export default function CommentPanel() {
  const { isCommentPanelOpen, setCommentPanelOpen } = useSidebarStore()

  return (
    <>
      {isCommentPanelOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[99] hidden bg-black/30 max-[1200px]:block"
          onClick={() => setCommentPanelOpen(false)}
          aria-label="إغلاق التعليقات"
        />
      )}

      <div
        className={`relative h-screen shrink-0 overflow-y-auto border-s border-[#e9e9e9] bg-[#F5F5F5] p-[45px_35px] no-scrollbar transition-all duration-300 max-[1700px]:p-[30px_10px_10px] max-[1200px]:absolute max-[1200px]:end-0 max-[1200px]:inset-y-0 max-[1200px]:z-[100] ${
          isCommentPanelOpen
            ? 'w-[309px] translate-x-0 max-[1700px]:w-[345px]'
            : 'w-0 !overflow-hidden border-s-0 !p-0 max-[1200px]:-translate-x-full'
        }`}
      >
        {isCommentPanelOpen && <CommentList />}
      </div>
    </>
  )
}
