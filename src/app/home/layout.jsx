import SideData from '@/components/home/SideData';
import CommentPanel from '@/components/comment/comment-panel';
import RoutePermissionGuard from '@/components/auth/RoutePermissionGuard';
import React from 'react'

export default function Profile({ children }) {

    return (
            <div className="flex relative">
                <SideData />
                <div className="min-w-0 flex-1 w-full p-[45px] h-screen overflow-y-auto transition-all max-[1700px]:p-[30px]">
                    <RoutePermissionGuard>
                        {children}
                    </RoutePermissionGuard>
                </div>
                <CommentPanel />
            </div>
    )
}
