import React, { useState } from 'react';
import { BookOpen, Search, Filter, Tag, Eye, ThumbsUp, Plus, FileText, ChevronRight, X, Copy, Check } from 'lucide-react';
import { KnowledgeArticle, MenuKey } from '../../types';

interface KnowledgeBaseViewProps {
  currentMenu: MenuKey;
  articles: KnowledgeArticle[];
  onAddArticle?: (article: Partial<KnowledgeArticle>) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  currentMenu,
  articles,
  onAddArticle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New article form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeArticle['category']>('故障排障');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');

  // Map sub-menu to category filter
  let categoryFilter: string | null = null;
  if (currentMenu === 'kb_troubleshooting') categoryFilter = '故障排障';
  else if (currentMenu === 'kb_sop') categoryFilter = '标准作业SOP';
  else if (currentMenu === 'kb_drills') categoryFilter = '应急预案';
  else if (currentMenu === 'kb_docs') categoryFilter = '架构文档';

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = !categoryFilter || art.category === categoryFilter;
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) {
      alert('请完整填写标题与摘要');
      return;
    }
    if (onAddArticle) {
      onAddArticle({
        title: newTitle,
        category: newCategory,
        summary: newSummary,
        author: '程总工 (Chief Architect)',
        updateTime: new Date().toISOString().slice(0, 10),
        tags: ['新知识沉淀', '运维经验'],
        views: 1,
        likes: 0,
        content: newContent.split('\n').filter((c) => c.trim().length > 0),
      });
      setIsCreateOpen(false);
      setNewTitle('');
      setNewSummary('');
      setNewContent('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>全息运维与架构知识库</span>
            <span className="text-xs font-normal text-slate-400">
              · {categoryFilter ? `${categoryFilter}专区` : '全域知识图谱'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            收录大数据物理硬件应急、标准作业程序 (SOP)、高可用容灾演练记录与湖仓架构白皮书
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-3 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-900/30"
        >
          <Plus className="w-3.5 h-3.5" />
          沉淀新知识文档
        </button>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索排障手册、SOP 流程、标签 (如 CPU, NVMe, HDFS)..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-mono text-xs">
          <span>收录文档: <strong className="text-cyan-400">{filteredArticles.length}</strong> 篇</span>
          <span>·</span>
          <span>技术分类: 4 大专栏</span>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.length === 0 ? (
          <div className="col-span-2 p-12 text-center rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-500">
            未找到匹配的知识库手册文档
          </div>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-3 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400 font-semibold">{article.id}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {article.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{article.updateTime}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 text-[10px] font-mono border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {article.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {article.likes}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/90">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400 font-semibold">{selectedArticle.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {selectedArticle.category}
                  </span>
                  <span className="text-xs text-slate-400">· 更新于 {selectedArticle.updateTime}</span>
                </div>
                <h2 className="text-base font-bold text-slate-100">{selectedArticle.title}</h2>
                <div className="text-xs text-cyan-400">编写人: {selectedArticle.author}</div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-medium">
                <strong>【核心摘要】：</strong>{selectedArticle.summary}
              </div>

              <div className="space-y-3">
                <span className="font-semibold text-slate-200 block">标准操作流程与步骤说明</span>
                <div className="space-y-2.5">
                  {selectedArticle.content.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/90 space-y-2"
                    >
                      <div className="text-slate-200 leading-relaxed font-sans">{step}</div>
                      {step.includes('`') && (
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-300">
                          <span>{step.split('`')[1]}</span>
                          <button
                            onClick={() => handleCopy(step.split('`')[1], idx)}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">已复制</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>复制命令</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400">此手册是否对解决当前生产异常有帮助？</span>
                <button
                  onClick={() => alert('感谢您的反馈！已计入工程师推荐经验。')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium flex items-center gap-1.5 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  标记有帮助 ({selectedArticle.likes})
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
              >
                关闭手册
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100">新增技术沉淀 / 排障手册</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">文档标题</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="如：Kafka 消费倾斜紧急处理手册"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">专栏分类</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as KnowledgeArticle['category'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="故障排障">故障排障</option>
                  <option value="标准作业SOP">标准作业SOP</option>
                  <option value="应急预案">应急预案</option>
                  <option value="架构文档">架构文档</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">核心摘要</label>
                <textarea
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="简述该方案解决的核心问题与适用场景..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">步骤详述 (每行一条)</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="1. 【现象定位】：查看报错日志&#10;2. 【执行命令】：`systemctl restart service`"
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500 resize-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  发布知识文档
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
