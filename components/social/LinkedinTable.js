"use client";

import { useState } from "react";
import ClayCard from "../ui/ClayCard";

export default function LinkedinTable({ data = [] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    if (data.length === 0) return null;

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    return (
        <ClayCard>
            <h2 className="text-lg font-semibold text-[#191919] mb-6">LinkedIn Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {currentData.map((item, index) => {
                    const author = item.author || {};
                    const stats = item.stats || {};
                    const postedAt = item.posted_at || {};
                    const content = item.content || null;

                    // Parse Content Block
                    let contentBlock = null;
                    if (content && content.type) {
                        const isArticle = content.type === "article";
                        const title = content.title || (isArticle ? content.article?.title : "");
                        const subtitle = content.description || (isArticle ? content.subtitle : "");
                        const imageUrl = content.image_url || (isArticle ? content.article?.thumbnail_url : "");
                        const extUrl = content.url || (isArticle ? content.article?.url : "");

                        if (title || imageUrl) {
                            contentBlock = (
                                <a href={extUrl || "#"} target="_blank" rel="noreferrer" className="block mt-4 rounded-lg border-2 border-[var(--border)] overflow-hidden bg-[var(--background)] hover:shadow-[4px_4px_0_var(--border)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                                    {imageUrl && (
                                        <img src={imageUrl} alt={title || "Attached content"} className="w-full h-32 object-cover border-b-2 border-[var(--border)]" />
                                    )}
                                    <div className="p-3">
                                        <div className="text-xs font-bold uppercase tracking-wider text-[var(--rw-purple)] mb-1">{content.type}</div>
                                        {title && <h3 className="text-sm font-semibold text-[#191919] line-clamp-2 leading-tight mb-1">{title}</h3>}
                                        {subtitle && <p className="text-xs text-[var(--muted)] line-clamp-1">{subtitle}</p>}
                                    </div>
                                </a>
                            );
                        }
                    }

                    return (
                        <div key={index} className="bg-white rounded-lg border-2 border-[var(--border)] shadow-[4px_4px_0_var(--border)] p-4 flex flex-col hover:shadow-[6px_6px_0_var(--border)] transition-shadow">
                            {/* Author Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <a href={author.profile_url || "#"} target="_blank" rel="noreferrer" className="shrink-0">
                                    {author.image_url ? (
                                        <img src={author.image_url} alt={author.name} className="w-12 h-12 rounded-full object-cover border-2 border-[var(--border)] shadow-[2px_2px_0_var(--border)]" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full border-2 border-[var(--border)] shadow-[2px_2px_0_var(--border)] bg-[#f0f0f0] flex items-center justify-center text-[#191919] font-bold text-lg">
                                            {author.name ? author.name.charAt(0).toUpperCase() : "?"}
                                        </div>
                                    )}
                                </a>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <a href={author.profile_url || "#"} target="_blank" rel="noreferrer" className="font-semibold text-[#191919] hover:underline truncate mr-2 block">
                                            {author.name || "Unknown Author"}
                                        </a>
                                        <span className="text-xs text-[var(--muted)] whitespace-nowrap shrink-0">{postedAt.display_text || ""}</span>
                                    </div>
                                    <p className="text-xs text-[var(--muted)] line-clamp-2 leading-tight">{author.headline || ""}</p>
                                </div>
                            </div>

                            {/* Post Body */}
                            <div className="flex-1 mb-4">
                                <p className="text-sm text-[#191919] whitespace-pre-wrap line-clamp-6">{item.text || ""}</p>
                                {item.post_url && (
                                    <a href={item.post_url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#4460ef] hover:underline mt-2 inline-block">
                                        View on LinkedIn &rarr;
                                    </a>
                                )}
                            </div>

                            {/* Attached Content */}
                            {contentBlock}

                            {/* Engagement Metrics */}
                            <div className="flex items-center gap-4 mt-auto pt-4 border-t-2 border-[var(--border)] text-xs font-semibold text-[var(--muted)]">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm">👍</span>
                                    {stats.total_reactions || 0}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm">💬</span>
                                    {stats.comments || 0}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm">🔄</span>
                                    {stats.shares || 0}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-2 border-[var(--border)] rounded-lg bg-white shadow-[4px_4px_0_var(--border)]">
                    <div className="text-sm text-[var(--muted)] font-medium">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-sm font-bold border-2 border-[var(--border)] rounded bg-[var(--background)] hover:bg-[#f0f0f0] shadow-[2px_2px_0_var(--border)] hover:shadow-[3px_3px_0_var(--border)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all text-[#191919]"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 text-sm font-bold border-2 border-[var(--border)] rounded bg-[var(--background)] hover:bg-[#f0f0f0] shadow-[2px_2px_0_var(--border)] hover:shadow-[3px_3px_0_var(--border)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all text-[#191919]"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </ClayCard>
    );
}
