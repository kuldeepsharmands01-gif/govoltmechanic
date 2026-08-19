import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Tag,
  Clock,
  User,
  Heart,
  Share2,
  Bookmark,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Filter,
  CheckCircle2,
  Wrench,
  ChevronRight,
  Eye,
  MessageSquare,
  ThumbsUp,
  X,
  Phone,
  Flame,
  Layers
} from 'lucide-react';
import { BlogPost } from '../types';
import { BLOG_CATEGORIES, BLOG_POSTS, BlogCategoryInfo } from '../data/blogData';

interface BlogTabProps {
  onOpenBooking: () => void;
  onOpenSOS?: () => void;
  specialistPhone?: string;
}

export const BlogTab: React.FC<BlogTabProps> = ({
  onOpenBooking,
  onOpenSOS,
  specialistPhone = '+91 63978 52208',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSort, setActiveSort] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Total articles count calculation
  const totalCategoryArticles = useMemo(() => {
    return BLOG_CATEGORIES.reduce((acc, cat) => acc + cat.count, 0);
  }, []);

  // Filtered posts based on search and category
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'All' ||
        post.category.toLowerCase() === selectedCategory.toLowerCase() ||
        post.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());

      // Search filter
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (activeSort === 'popular') return b.views - a.views;
      if (activeSort === 'trending') return (b.likes + (likedPosts[b.id] ? 1 : 0)) - (a.likes + (likedPosts[a.id] ? 1 : 0));
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });
  }, [selectedCategory, searchQuery, activeSort, likedPosts]);

  // Featured Hero Article
  const featuredPost = useMemo(() => {
    return BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  }, []);

  const handleToggleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleToggleBookmark = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleShareArticle = (post: BlogPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${post.title} - Read on GoVoltMechanic Blog`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D0E15] via-[#12141F] to-[#0A0B10] border border-white/10 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-mono font-bold tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>GOVOLT KNOWLEDGE BASE & TWO-WHEELER HUB</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Motorcycle & EV Maintenance Insights, Guides & Industry Trends
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Expert maintenance tutorials, engine oil comparisons, government RTO guidelines, EV battery care tips, and doorstep bike repair advice written by certified master technicians.
          </p>

          {/* Quick Search & Filter Bar */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles on engine oil, brake pads, PUCC, EV batteries, bike service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/15 focus:border-cyan-400 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none shadow-lg transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveSort('recent')}
                className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeSort === 'recent'
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Latest</span>
              </button>
              <button
                onClick={() => setActiveSort('popular')}
                className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeSort === 'popular'
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Popular</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Bar with Exact Counts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-300">
              Browse Topics & Categories ({BLOG_CATEGORIES.length} Categories • {totalCategoryArticles}+ Articles)
            </h2>
          </div>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs text-cyan-400 hover:underline font-bold"
            >
              Clear Filter (Show All)
            </button>
          )}
        </div>

        {/* Scrollable Category Chips with Exact User-Requested Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(34,211,238,0.4)] font-black'
                : 'bg-[#0D0E15] border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            <span>All Articles</span>
            <span className="px-1.5 py-0.2 bg-black/20 text-[10px] font-mono rounded">
              {totalCategoryArticles}
            </span>
          </button>

          {BLOG_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(34,211,238,0.4)] font-black'
                    : 'bg-[#0D0E15] border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/40 hover:bg-white/5'
                }`}
                title={cat.description}
              >
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-mono rounded font-black ${
                    isSelected
                      ? 'bg-black/30 text-black'
                      : 'bg-white/10 text-cyan-300 border border-white/5'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Hero Article Section */}
      {selectedCategory === 'All' && !searchQuery && featuredPost && (
        <div
          onClick={() => setSelectedArticle(featuredPost)}
          className="cursor-pointer group relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-[#0D0E15] border border-cyan-500/30 hover:border-cyan-400 transition-all p-6 sm:p-8 shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-red-500/20 text-red-400 font-mono text-[10px] font-black uppercase rounded-lg border border-red-500/30 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-400" /> FEATURED STORY
                </span>
                <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold rounded-lg">
                  {featuredPost.category}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {featuredPost.readTime}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors leading-tight">
                {featuredPost.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    className="w-8 h-8 rounded-full object-cover border border-cyan-400"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{featuredPost.author.name}</p>
                    <p className="text-[10px] text-slate-400">{featuredPost.author.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-video sm:aspect-auto sm:h-64 border border-white/10">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                <span className="flex items-center gap-1 font-mono font-bold bg-black/60 px-2 py-1 rounded-lg backdrop-blur-md">
                  <Eye className="w-3 h-3 text-cyan-400" /> {featuredPost.views.toLocaleString()} Views
                </span>
                <span className="flex items-center gap-1 font-mono font-bold bg-black/60 px-2 py-1 rounded-lg backdrop-blur-md">
                  <Heart className="w-3 h-3 text-red-400" /> {featuredPost.likes} Likes
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Articles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span>{selectedCategory === 'All' ? 'Latest Publications' : `${selectedCategory} Articles`}</span>
            <span className="text-xs text-slate-400 font-mono font-normal">
              ({filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'})
            </span>
          </h3>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-[#0D0E15] border border-white/10 rounded-3xl space-y-3">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="text-base font-bold text-white">No Articles Found</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No matching publications for "{searchQuery}" under {selectedCategory}. Try resetting the search or category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-cyan-500 text-black text-xs font-black uppercase rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const isLiked = likedPosts[post.id];
              const isBookmarked = bookmarkedPosts[post.id];

              return (
                <div
                  key={post.id}
                  onClick={() => setSelectedArticle(post)}
                  className="bg-[#0D0E15] border border-white/10 hover:border-cyan-400/50 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] flex flex-col group cursor-pointer"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    {/* Category Pill */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-cyan-300 font-mono text-[10px] font-bold rounded-lg border border-cyan-400/30">
                        {post.category}
                      </span>
                    </div>

                    {/* Action buttons (Bookmark & Share) */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleToggleBookmark(post.id, e)}
                        className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${
                          isBookmarked
                            ? 'bg-amber-500 text-black'
                            : 'bg-black/60 text-slate-300 hover:text-white'
                        }`}
                        title="Bookmark Article"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleShareArticle(post, e)}
                        className="p-1.5 bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white rounded-lg backdrop-blur-md transition-all"
                        title="Share"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Stats footer in image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-slate-300 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" /> {post.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-400" /> {post.views.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-white/5 text-slate-400 text-[10px] font-mono rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Author & Likes Bar */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover border border-cyan-400/40"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-200 truncate">{post.author.name}</p>
                          <p className="text-[9px] text-slate-500">{post.publishDate}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleToggleLike(post.id, e)}
                        className={`flex items-center gap-1 text-xs font-mono font-bold transition-colors ${
                          isLiked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likes + (isLiked ? 1 : 0)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Doorstep Booking Banner inside Blog */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold uppercase rounded-lg border border-cyan-500/30">
            EXPERIENCE DOORSTEP CONVENIENCE
          </span>
          <h3 className="text-xl font-black text-white">
            Need Bike or Scooter Service at Your Doorstep?
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Book certified mechanic visit from ₹450 with 100% genuine parts, transparent digital pricing, and live job cards across Delhi NCR and UP.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href={`tel:${specialistPhone}`}
            className="w-full sm:w-auto px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-green-400" />
            <span>{specialistPhone}</span>
          </a>

          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95 flex items-center justify-center gap-2"
          >
            <Wrench className="w-4 h-4" />
            <span>Book Service Now</span>
          </button>
        </div>
      </div>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0D0E15] border border-cyan-500/30 rounded-3xl w-full max-w-3xl overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.3)] flex flex-col max-h-[90vh]">
            {/* Modal Top Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90 shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold rounded-lg">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" /> {selectedArticle.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleLike(selectedArticle.id)}
                  className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-mono ${
                    likedPosts[selectedArticle.id]
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts[selectedArticle.id] ? 'fill-current' : ''}`} />
                  <span>{selectedArticle.likes + (likedPosts[selectedArticle.id] ? 1 : 0)}</span>
                </button>

                <button
                  onClick={() => handleShareArticle(selectedArticle)}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl transition-all"
                  title="Share Article"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              {/* Article Hero Banner */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-white/10">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Author Meta */}
              <div className="space-y-3">
                <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {selectedArticle.title}
                </h1>

                <div className="flex items-center justify-between border-y border-white/10 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedArticle.author.avatar}
                      alt={selectedArticle.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-cyan-400"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{selectedArticle.author.name}</p>
                      <p className="text-[10px] text-slate-400">{selectedArticle.author.role}</p>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 font-mono">
                    <p>{selectedArticle.publishDate}</p>
                    <p>{selectedArticle.views.toLocaleString()} reads</p>
                  </div>
                </div>
              </div>

              {/* Formatted Markdown-Like Body */}
              <div className="prose prose-invert max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed space-y-4 whitespace-pre-line">
                {selectedArticle.content}
              </div>

              {/* Tags Section */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2 items-center">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] uppercase font-bold text-slate-400">Related Tags:</span>
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 text-cyan-300 text-xs font-mono rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* CTA Inside Article */}
              <div className="p-5 bg-gradient-to-r from-cyan-950/60 to-slate-900 rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-xs font-black text-white uppercase tracking-wider">
                    Need Professional Help for Your Bike?
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Book an on-demand doorstep tune-up from ₹450 with 100% genuine parts.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    onOpenBooking();
                  }}
                  className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] shrink-0 flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Book Doorstep Service</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
