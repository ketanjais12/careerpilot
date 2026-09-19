import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  FileText,
  LogOut,
  Plus,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  UserRound,
  XCircle,
  ClipboardCheck,
  Bookmark,
  MessageSquareText,
} from 'lucide-react';

import { AuthContext } from '../context/AuthContext';
import {
  getApplications,
  getApplicationStats,
  deleteApplication
} from '../services/applicationService';

import StatusBadge from '../components/StatusBadge';
import ResumeUpload from '../components/ResumeUpload';

const Dashboard = () => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appRes, statsRes] = await Promise.all([
          getApplications(),
          getApplicationStats()
        ]);

        setApplications(appRes.data || appRes);
        setStats(statsRes.data || statsRes);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (appId) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this application?'
    );

    if (!isConfirmed) return;

    try {
      await deleteApplication(appId);
      setApplications(prev =>
        prev.filter(app => app._id !== appId)
      );

      const statsRes = await getApplicationStats();
      setStats(statsRes.data || statsRes);
    } catch (err) {
      alert('Failed to delete the application. Please try again.');
    }
  };

  const getPercent = (count) => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((count / stats.total) * 100);
  };

  const statCards = stats
    ? [
        {
          label: 'Saved',
          value: stats.saved || 0,
          icon: Bookmark,
          accent: 'text-zinc-300',
          iconBg: 'bg-zinc-800/70',
          bar: 'bg-zinc-500',
        },
        {
          label: 'Applied',
          value: stats.applied || 0,
          icon: BriefcaseBusiness,
          accent: 'text-sky-400',
          iconBg: 'bg-sky-400/10',
          bar: 'bg-sky-400',
        },
        {
          label: 'Assessment',
          value: stats.assessment || 0,
          icon: ClipboardCheck,
          accent: 'text-violet-400',
          iconBg: 'bg-violet-400/10',
          bar: 'bg-violet-400',
        },
        {
          label: 'Interview',
          value: stats.interview || 0,
          icon: MessageSquareText,
          accent: 'text-amber-400',
          iconBg: 'bg-amber-400/10',
          bar: 'bg-amber-400',
        },
        {
          label: 'Selected',
          value: stats.selected || 0,
          icon: CheckCircle2,
          accent: 'text-lime-400',
          iconBg: 'bg-lime-400/10',
          bar: 'bg-lime-400',
        },
        {
          label: 'Rejected',
          value: stats.rejected || 0,
          icon: XCircle,
          accent: 'text-rose-400',
          iconBg: 'bg-rose-400/10',
          bar: 'bg-rose-400',
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-5">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-lime-400/10 animate-pulse" />
            <Sparkles className="relative h-6 w-6 text-lime-400" />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-zinc-200">
              Preparing your dashboard
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Loading your career data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-rose-500/20 bg-[#0d0d0d] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10">
            <XCircle className="h-6 w-6 text-rose-400" />
          </div>

          <h2 className="text-lg font-semibold text-white">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white selection:bg-lime-400/30">

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-lime-400/[0.035] blur-3xl" />
        <div className="absolute -right-40 top-72 h-96 w-96 rounded-full bg-emerald-500/[0.025] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">

        {/* ==================== HEADER ==================== */}
        <header className="mb-10">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400" />
                </span>

                <span className="text-[11px] font-medium tracking-wide text-zinc-400">
                  CAREERPILOT AI
                </span>
              </div>

              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Welcome back,{' '}
                <span className="text-lime-400">
                  {user.name}
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
                Keep your applications organized, understand your progress,
                and stay prepared for what comes next.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">

              <Link
                to="/applications/new"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-semibold text-black shadow-[0_0_30px_rgba(163,230,53,0.12)] transition-all duration-200 hover:bg-lime-300 hover:shadow-[0_0_35px_rgba(163,230,53,0.2)] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                New Application
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <button
                onClick={logout}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm font-medium text-zinc-400 backdrop-blur-xl transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white active:scale-[0.98]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>

            </div>
          </div>
        </header>


        {/* ==================== QUICK OVERVIEW ==================== */}
        {stats && (
          <section className="mb-8">

            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-lime-400/80">
                  Overview
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  Application pipeline
                </h2>
              </div>

              <div className="hidden items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 sm:flex">
                <TrendingUp className="h-4 w-4 text-lime-400" />
                <span className="text-sm text-zinc-400">
                  {stats.total || 0} total
                </span>
              </div>
            </div>


            {/* Main pipeline card */}
            <div className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-[#0b0b0b]/90 shadow-2xl backdrop-blur-xl">

              <div className="p-5 sm:p-7">

                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Your job search activity
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      Distribution across your current applications
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-lime-400/10 bg-lime-400/5">
                    <Target className="h-5 w-5 text-lime-400" />
                  </div>
                </div>


                {/* Pipeline bar */}
                <div className="mb-7 h-3 w-full overflow-hidden rounded-full bg-zinc-900 ring-1 ring-inset ring-zinc-800">
                  <div className="flex h-full w-full">
                    {stats.saved > 0 && (
                      <div
                        style={{ width: `${getPercent(stats.saved)}%` }}
                        className="bg-zinc-500 transition-all duration-700"
                        title="Saved"
                      />
                    )}

                    {stats.applied > 0 && (
                      <div
                        style={{ width: `${getPercent(stats.applied)}%` }}
                        className="bg-sky-400 transition-all duration-700"
                        title="Applied"
                      />
                    )}

                    {stats.assessment > 0 && (
                      <div
                        style={{ width: `${getPercent(stats.assessment)}%` }}
                        className="bg-violet-400 transition-all duration-700"
                        title="Assessment"
                      />
                    )}

                    {stats.interview > 0 && (
                      <div
                        style={{ width: `${getPercent(stats.interview)}%` }}
                        className="bg-amber-400 transition-all duration-700"
                        title="Interview"
                      />
                    )}

                    {stats.selected > 0 && (
                      <div
                        style={{ width: `${getPercent(stats.selected)}%` }}
                        className="bg-lime-400 transition-all duration-700"
                        title="Selected"
                      />
                    )}

                    {stats.rejected > 0 && (
                      <div
                        style={{ width: `${getPercent(stats.rejected)}%` }}
                        className="bg-rose-400 transition-all duration-700"
                        title="Rejected"
                      />
                    )}
                  </div>
                </div>


                {/* Statistics */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {statCards.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        key={stat.label}
                        className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900/80"
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.iconBg}`}
                          >
                            <Icon className={`h-4 w-4 ${stat.accent}`} />
                          </div>

                          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-700">
                            {stat.label}
                          </span>
                        </div>

                        <p className="mt-5 text-2xl font-semibold tracking-tight text-white">
                          {stat.value}
                        </p>

                        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-zinc-900">
                          <div
                            className={`h-full ${stat.bar} opacity-60 transition-all duration-500 group-hover:opacity-100`}
                            style={{
                              width: `${getPercent(stat.value)}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          </section>
        )}


        {/* ==================== AI + RESUME ==================== */}
        <section className="mb-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">

          {/* AI Career Intelligence */}
          <div className="group relative overflow-hidden rounded-3xl border border-lime-400/10 bg-[#0b0b0b] p-6 shadow-2xl sm:p-8">

            {/* AI glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-lime-400/[0.07] blur-3xl transition-all duration-500 group-hover:bg-lime-400/[0.11]" />

            <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 bg-gradient-to-tl from-lime-400/[0.05] to-transparent" />

            <div className="relative">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-400/20 bg-lime-400/10">
                    <Sparkles className="h-5 w-5 text-lime-400" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-lime-400">
                        AI Intelligence
                      </span>

                      <span className="rounded-full border border-lime-400/10 bg-lime-400/5 px-2 py-0.5 text-[9px] font-medium text-lime-400/80">
                        ACTIVE
                      </span>
                    </div>

                    <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                      Your career, powered by AI.
                    </h2>
                  </div>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 sm:flex">
                  <ArrowUpRight className="h-4 w-4 text-zinc-600 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime-400" />
                </div>

              </div>

              <p className="mt-6 max-w-xl text-sm leading-6 text-zinc-500">
                Use your resume, applications and interview data to turn
                your job search into actionable career insights.
              </p>


              <div className="mt-7 grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition-colors duration-200 hover:border-lime-400/20">
                  <FileText className="h-4 w-4 text-lime-400" />
                  <p className="mt-3 text-sm font-medium text-zinc-200">
                    Resume Analysis
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Understand your strengths
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition-colors duration-200 hover:border-lime-400/20">
                  <Target className="h-4 w-4 text-lime-400" />
                  <p className="mt-3 text-sm font-medium text-zinc-200">
                    Job Matching
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Identify skill gaps
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition-colors duration-200 hover:border-lime-400/20">
                  <MessageSquareText className="h-4 w-4 text-lime-400" />
                  <p className="mt-3 text-sm font-medium text-zinc-200">
                    Interview Prep
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Prepare with AI
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition-colors duration-200 hover:border-lime-400/20">
                  <TrendingUp className="h-4 w-4 text-lime-400" />
                  <p className="mt-3 text-sm font-medium text-zinc-200">
                    Career Insights
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Track your progress
                  </p>
                </div>

              </div>

            </div>
          </div>


          {/* Resume */}
          <div className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-[#0b0b0b] shadow-2xl">

            <div className="border-b border-zinc-800/80 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900">
                  <FileText className="h-5 w-5 text-zinc-300" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-600">
                    Career Asset
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-white">
                    Your Resume
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-6">
              <ResumeUpload
                hasExistingResume={!!user?.resumeText}
                existingFileName={user?.resumeFileName}
onUploadSuccess={(data) => {
  updateUser(data);
}}
              />
            </div>

          </div>

        </section>


        {/* ==================== APPLICATIONS ==================== */}
        <section className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-[#0b0b0b] shadow-2xl">

          {/* Section header */}
          <div className="flex flex-col gap-4 border-b border-zinc-800/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900">
                <BriefcaseBusiness className="h-5 w-5 text-zinc-300" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-600">
                  Job Search
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  Recent Applications
                </h2>
              </div>
            </div>

            <Link
              to="/applications/new"
              className="group inline-flex items-center gap-1.5 self-start rounded-lg px-3 py-2 text-xs font-medium text-zinc-500 transition-colors duration-200 hover:bg-zinc-900 hover:text-lime-400 sm:self-auto"
            >
              Add application
              <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

          </div>


          {/* Applications */}
          {applications.length === 0 ? (

            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
                <BriefcaseBusiness className="h-6 w-6 text-zinc-600" />
              </div>

              <h3 className="text-base font-medium text-zinc-200">
                No applications yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600">
                Start tracking your job search by adding your first
                application.
              </p>

              <Link
                to="/applications/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-lime-300 active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Add first application
              </Link>

            </div>

          ) : (

            <div className="divide-y divide-zinc-800/70">

              {applications.map((app) => (

                <div
                  key={app._id}
                  className="group flex flex-col gap-4 p-5 transition-all duration-200 hover:bg-zinc-900/40 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >

                  <Link
                    to={`/applications/${app._id}`}
                    className="flex min-w-0 flex-1 items-center gap-4"
                  >

                    <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 sm:flex">
                      <BriefcaseBusiness className="h-4 w-4 text-zinc-600 transition-colors duration-200 group-hover:text-lime-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-200 transition-colors duration-200 group-hover:text-lime-400 sm:text-base">
                        {app.jobTitle}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-600">
                        <span>{app.company}</span>

                        {app.location && (
                          <>
                            <span className="text-zinc-800">•</span>
                            <span>{app.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-zinc-700 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime-400 sm:block" />

                  </Link>


                  <div className="flex items-center justify-between gap-4 sm:justify-end">

                    <StatusBadge status={app.status} />

                    <button
                      onClick={() => handleDelete(app._id)}
                      aria-label={`Delete ${app.jobTitle} application`}
                      className="group/delete inline-flex items-center gap-2 rounded-lg border border-transparent px-2.5 py-2 text-xs font-medium text-zinc-600 transition-all duration-200 hover:border-rose-500/10 hover:bg-rose-500/5 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5 transition-transform duration-200 group-hover/delete:scale-110" />
                      <span className="hidden sm:inline">
                        Delete
                      </span>
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* Footer insight */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-zinc-700">
          <UserRound className="h-3.5 w-3.5" />
          <span>
            CareerPilot keeps your career journey organized in one place.
          </span>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;

