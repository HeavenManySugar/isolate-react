import { useState, useEffect, useCallback } from "react";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface IsolateConfig {
  // Basic options
  boxId: string;
  metaFile: string;
  stdin: string;
  stdout: string;
  stderr: string;
  stderrToStdout: boolean;
  chdir: string;
  verbose: boolean;
  silent: boolean;
  wait: boolean;

  // Limits
  memory: string;
  time: string;
  wallTime: string;
  extraTime: string;
  stack: string;
  openFiles: string;
  fileSize: string;
  quotaBlocks: string;
  quotaInodes: string;
  coreSize: string;
  processes: string;

  // Environment
  envVars: { key: string; value: string }[];
  fullEnv: boolean;

  // Directories
  directories: { inside: string; outside: string; options: string }[];
  noDefaultDirs: boolean;

  // Control Groups
  enableCg: boolean;
  cgMem: string;

  // Special options
  shareNet: boolean;
  inheritFds: boolean;
  specialFiles: boolean;
  ttyHack: boolean;
  asUid: string;
  asGid: string;

  // Program
  program: string;
  arguments: string;
}

export default function Home() {
  const [config, setConfig] = useState<IsolateConfig>({
    boxId: "0",
    metaFile: "",
    stdin: "",
    stdout: "",
    stderr: "",
    stderrToStdout: false,
    chdir: "",
    verbose: false,
    silent: false,
    wait: false,
    memory: "",
    time: "",
    wallTime: "",
    extraTime: "",
    stack: "",
    openFiles: "",
    fileSize: "",
    quotaBlocks: "",
    quotaInodes: "",
    coreSize: "",
    processes: "",
    envVars: [],
    fullEnv: false,
    directories: [],
    noDefaultDirs: false,
    enableCg: false,
    cgMem: "",
    shareNet: false,
    inheritFds: false,
    specialFiles: false,
    ttyHack: false,
    asUid: "",
    asGid: "",
    program: "",
    arguments: "",
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [generatedCommand, setGeneratedCommand] = useState("");

  // 預設配置模板
  const presetConfigs = {
    basic: {
      name: "基本配置",
      description: "適合一般程式執行的基本配置",
      config: {
        boxId: "0",
        memory: "262144",
        time: "1",
        wallTime: "2",
        processes: "1",
        program: "./program",
        arguments: ""
      }
    },
    competitive: {
      name: "競程配置",
      description: "適合競程題目的嚴格限制配置",
      config: {
        boxId: "0",
        memory: "262144",
        time: "1",
        wallTime: "2",
        stack: "8192",
        openFiles: "16",
        processes: "1",
        program: "./solution",
        stdin: "input.txt",
        stdout: "output.txt",
        stderr: "error.txt"
      }
    },
    development: {
      name: "開發測試",
      description: "適合開發和測試的寬鬆配置",
      config: {
        boxId: "0",
        memory: "1048576",
        time: "10",
        wallTime: "20",
        verbose: true,
        shareNet: true,
        program: "./test",
        arguments: ""
      }
    }
  };

  const generateCommand = useCallback(() => {
    let cmd = "isolate";

    // Basic options
    if (config.boxId) cmd += ` --box-id=${config.boxId}`;
    if (config.metaFile) cmd += ` --meta=${config.metaFile}`;
    if (config.stdin) cmd += ` --stdin=${config.stdin}`;
    if (config.stdout) cmd += ` --stdout=${config.stdout}`;
    if (config.stderr && !config.stderrToStdout) cmd += ` --stderr=${config.stderr}`;
    if (config.stderrToStdout) cmd += " --stderr-to-stdout";
    if (config.chdir) cmd += ` --chdir=${config.chdir}`;
    if (config.verbose) cmd += " --verbose";
    if (config.silent) cmd += " --silent";
    if (config.wait) cmd += " --wait";

    // Limits
    if (config.memory) cmd += ` --mem=${config.memory}`;
    if (config.time) cmd += ` --time=${config.time}`;
    if (config.wallTime) cmd += ` --wall-time=${config.wallTime}`;
    if (config.extraTime) cmd += ` --extra-time=${config.extraTime}`;
    if (config.stack) cmd += ` --stack=${config.stack}`;
    if (config.openFiles) cmd += ` --open-files=${config.openFiles}`;
    if (config.fileSize) cmd += ` --fsize=${config.fileSize}`;
    if (config.quotaBlocks && config.quotaInodes) {
      cmd += ` --quota=${config.quotaBlocks},${config.quotaInodes}`;
    }
    if (config.coreSize) cmd += ` --core=${config.coreSize}`;
    if (config.processes) cmd += ` --processes=${config.processes}`;

    // Environment
    config.envVars.forEach(env => {
      if (env.key) {
        cmd += ` --env=${env.key}${env.value ? `=${env.value}` : ''}`;
      }
    });
    if (config.fullEnv) cmd += " --full-env";

    // Directories
    config.directories.forEach(dir => {
      if (dir.inside) {
        let dirCmd = ` --dir=${dir.inside}`;
        if (dir.outside) dirCmd += `=${dir.outside}`;
        if (dir.options) dirCmd += `:${dir.options}`;
        cmd += dirCmd;
      }
    });
    if (config.noDefaultDirs) cmd += " --no-default-dirs";

    // Control Groups
    if (config.enableCg) cmd += " --cg";
    if (config.cgMem) cmd += ` --cg-mem=${config.cgMem}`;

    // Special options
    if (config.shareNet) cmd += " --share-net";
    if (config.inheritFds) cmd += " --inherit-fds";
    if (config.specialFiles) cmd += " --special-files";
    if (config.ttyHack) cmd += " --tty-hack";
    if (config.asUid) cmd += ` --as-uid=${config.asUid}`;
    if (config.asGid) cmd += ` --as-gid=${config.asGid}`;

    // Add run command
    cmd += " --run";

    // Program and arguments
    if (config.program) {
      cmd += ` -- ${config.program}`;
      if (config.arguments) cmd += ` ${config.arguments}`;
    }

    setGeneratedCommand(cmd);
  }, [config]);

  const addEnvVar = () => {
    setConfig(prev => ({
      ...prev,
      envVars: [...prev.envVars, { key: "", value: "" }]
    }));
  };

  const removeEnvVar = (index: number) => {
    setConfig(prev => ({
      ...prev,
      envVars: prev.envVars.filter((_, i) => i !== index)
    }));
  };

  const updateEnvVar = (index: number, field: 'key' | 'value', value: string) => {
    setConfig(prev => ({
      ...prev,
      envVars: prev.envVars.map((env, i) =>
        i === index ? { ...env, [field]: value } : env
      )
    }));
  };

  const addDirectory = () => {
    setConfig(prev => ({
      ...prev,
      directories: [...prev.directories, { inside: "", outside: "", options: "" }]
    }));
  };

  const removeDirectory = (index: number) => {
    setConfig(prev => ({
      ...prev,
      directories: prev.directories.filter((_, i) => i !== index)
    }));
  };

  const updateDirectory = (index: number, field: 'inside' | 'outside' | 'options', value: string) => {
    setConfig(prev => ({
      ...prev,
      directories: prev.directories.map((dir, i) =>
        i === index ? { ...dir, [field]: value } : dir
      )
    }));
  };

  const applyPreset = (presetKey: string) => {
    const preset = presetConfigs[presetKey as keyof typeof presetConfigs];
    if (preset) {
      // 先重置為預設的空配置，然後應用預設值
      const defaultConfig: IsolateConfig = {
        boxId: "0",
        metaFile: "",
        stdin: "",
        stdout: "",
        stderr: "",
        stderrToStdout: false,
        chdir: "",
        verbose: false,
        silent: false,
        wait: false,
        memory: "",
        time: "",
        wallTime: "",
        extraTime: "",
        stack: "",
        openFiles: "",
        fileSize: "",
        quotaBlocks: "",
        quotaInodes: "",
        coreSize: "",
        processes: "",
        envVars: [],
        fullEnv: false,
        directories: [],
        noDefaultDirs: false,
        enableCg: false,
        cgMem: "",
        shareNet: false,
        inheritFds: false,
        specialFiles: false,
        ttyHack: false,
        asUid: "",
        asGid: "",
        program: "",
        arguments: "",
      };
      setConfig({ ...defaultConfig, ...preset.config });
    }
  };

  const exportConfig = () => {
    const configJson = JSON.stringify(config, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'isolate-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string);
          setConfig(importedConfig);
        } catch {
          alert('配置文件格式錯誤');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: "basic", label: "基本選項" },
    { id: "limits", label: "資源限制" },
    { id: "environment", label: "環境變數" },
    { id: "directories", label: "目錄規則" },
    { id: "control", label: "控制組" },
    { id: "special", label: "特殊選項" },
    { id: "program", label: "程式設定" },
    { id: "presets", label: "配置管理" },
  ];

  // 自動生成命令 - 當配置變更時
  useEffect(() => {
    generateCommand();
  }, [config, generateCommand]); // 依賴 config 和 generateCommand，當配置變更時自動重新生成命令

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gray-50 dark:bg-gray-900`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Isolate 沙盒配置工具
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                視覺化配置 Linux Container 隔離環境
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                v1.2.0
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "basic" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">基本選項</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Box ID
                        </label>
                        <input
                          type="text"
                          value={config.boxId}
                          onChange={(e) => setConfig(prev => ({ ...prev, boxId: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          唯一的沙盒標識符 (預設: 0)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Meta File
                        </label>
                        <input
                          type="text"
                          value={config.metaFile}
                          onChange={(e) => setConfig(prev => ({ ...prev, metaFile: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="meta.txt"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          輸出執行元數據的文件
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Standard Input
                        </label>
                        <input
                          type="text"
                          value={config.stdin}
                          onChange={(e) => setConfig(prev => ({ ...prev, stdin: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="input.txt"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Standard Output
                        </label>
                        <input
                          type="text"
                          value={config.stdout}
                          onChange={(e) => setConfig(prev => ({ ...prev, stdout: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="output.txt"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Standard Error
                        </label>
                        <input
                          type="text"
                          value={config.stderr}
                          onChange={(e) => setConfig(prev => ({ ...prev, stderr: e.target.value }))}
                          disabled={config.stderrToStdout}
                          className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${config.stderrToStdout ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="error.txt"
                        />
                        {config.stderrToStdout && (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                            已啟用 stderr-to-stdout，此欄位已停用
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Working Directory
                        </label>
                        <input
                          type="text"
                          value={config.chdir}
                          onChange={(e) => setConfig(prev => ({ ...prev, chdir: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="/tmp"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.verbose}
                          onChange={(e) => setConfig(prev => ({ ...prev, verbose: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                          詳細輸出 (Verbose)
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.silent}
                          onChange={(e) => setConfig(prev => ({ ...prev, silent: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                          靜音模式 (Silent)
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.stderrToStdout}
                          onChange={(e) => setConfig(prev => ({ ...prev, stderrToStdout: e.target.checked, stderr: e.target.checked ? "" : prev.stderr }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                          重定向錯誤到標準輸出 (stderr-to-stdout)
                        </label>
                        <p className="ml-6 text-xs text-gray-500 dark:text-gray-400">
                          將標準錯誤重定向到標準輸出，與 --stderr 互斥
                        </p>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.wait}
                          onChange={(e) => setConfig(prev => ({ ...prev, wait: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                          等待程式結束 (wait)
                        </label>
                        <p className="ml-6 text-xs text-gray-500 dark:text-gray-400">
                          等待程式正常結束，不強制終止
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "limits" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">資源限制</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          記憶體限制 (KB)
                        </label>
                        <input
                          type="text"
                          value={config.memory}
                          onChange={(e) => setConfig(prev => ({ ...prev, memory: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="262144"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          程式可使用的最大記憶體 (KB)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          時間限制 (秒)
                        </label>
                        <input
                          type="text"
                          value={config.time}
                          onChange={(e) => setConfig(prev => ({ ...prev, time: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="1.5"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          程式 CPU 時間限制 (支援小數)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          實際時間限制 (秒)
                        </label>
                        <input
                          type="text"
                          value={config.wallTime}
                          onChange={(e) => setConfig(prev => ({ ...prev, wallTime: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="10"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          額外時間 (秒)
                        </label>
                        <input
                          type="text"
                          value={config.extraTime}
                          onChange={(e) => setConfig(prev => ({ ...prev, extraTime: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="0.5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          堆疊大小 (KB)
                        </label>
                        <input
                          type="text"
                          value={config.stack}
                          onChange={(e) => setConfig(prev => ({ ...prev, stack: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="8192"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          開啟檔案數量
                        </label>
                        <input
                          type="text"
                          value={config.openFiles}
                          onChange={(e) => setConfig(prev => ({ ...prev, openFiles: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="64"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          檔案大小限制 (KB)
                        </label>
                        <input
                          type="text"
                          value={config.fileSize}
                          onChange={(e) => setConfig(prev => ({ ...prev, fileSize: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="1024"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          磁碟配額 - 區塊數 (Quota Blocks)
                        </label>
                        <input
                          type="text"
                          value={config.quotaBlocks}
                          onChange={(e) => setConfig(prev => ({ ...prev, quotaBlocks: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="1024"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          磁碟配額的區塊數限制 (與 inodes 一起使用)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          磁碟配額 - Inodes 數 (Quota Inodes)
                        </label>
                        <input
                          type="text"
                          value={config.quotaInodes}
                          onChange={(e) => setConfig(prev => ({ ...prev, quotaInodes: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="256"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          磁碟配額的 inode 數限制 (與 blocks 一起使用)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Core 檔案大小限制 (KB)
                        </label>
                        <input
                          type="text"
                          value={config.coreSize}
                          onChange={(e) => setConfig(prev => ({ ...prev, coreSize: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="0"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Core dump 檔案的大小限制
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          程序數量限制
                        </label>
                        <input
                          type="text"
                          value={config.processes}
                          onChange={(e) => setConfig(prev => ({ ...prev, processes: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "environment" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">環境變數</h3>
                      <button
                        onClick={addEnvVar}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        新增變數
                      </button>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.fullEnv}
                        onChange={(e) => setConfig(prev => ({ ...prev, fullEnv: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                        繼承所有環境變數
                      </label>
                    </div>

                    <div className="space-y-4">
                      {config.envVars.map((env, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <input
                            type="text"
                            value={env.key}
                            onChange={(e) => updateEnvVar(index, 'key', e.target.value)}
                            placeholder="變數名稱"
                            className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                          <span className="text-gray-500">=</span>
                          <input
                            type="text"
                            value={env.value}
                            onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                            placeholder="變數值"
                            className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                          <button
                            onClick={() => removeEnvVar(index)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            刪除
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "directories" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">目錄規則</h3>
                      <button
                        onClick={addDirectory}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        新增目錄
                      </button>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.noDefaultDirs}
                        onChange={(e) => setConfig(prev => ({ ...prev, noDefaultDirs: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                        不使用預設目錄
                      </label>
                    </div>

                    <div className="space-y-4">
                      {config.directories.map((dir, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                沙盒內路徑
                              </label>
                              <input
                                type="text"
                                value={dir.inside}
                                onChange={(e) => updateDirectory(index, 'inside', e.target.value)}
                                placeholder="/box/data"
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                主機路徑
                              </label>
                              <input
                                type="text"
                                value={dir.outside}
                                onChange={(e) => updateDirectory(index, 'outside', e.target.value)}
                                placeholder="/home/user/data"
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                選項 (rw,dev,noexec,maybe)
                              </label>
                              <input
                                type="text"
                                value={dir.options}
                                onChange={(e) => updateDirectory(index, 'options', e.target.value)}
                                placeholder="rw"
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => removeDirectory(index)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                            >
                              刪除目錄
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "control" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">控制組 (Control Groups)</h3>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.enableCg}
                        onChange={(e) => setConfig(prev => ({ ...prev, enableCg: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                        啟用控制組
                      </label>
                    </div>

                    {config.enableCg && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          控制組記憶體限制 (KB)
                        </label>
                        <input
                          type="text"
                          value={config.cgMem}
                          onChange={(e) => setConfig(prev => ({ ...prev, cgMem: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="262144"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          整個控制組的總記憶體使用限制
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "special" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">特殊選項</h3>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.shareNet}
                          onChange={(e) => setConfig(prev => ({ ...prev, shareNet: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                          共享網路命名空間
                        </label>
                        <p className="ml-4 text-xs text-gray-500 dark:text-gray-400">
                          允許程式與外部網路通信
                        </p>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.inheritFds}
                          onChange={(e) => setConfig(prev => ({ ...prev, inheritFds: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                          繼承檔案描述符
                        </label>
                        <p className="ml-4 text-xs text-gray-500 dark:text-gray-400">
                          保留額外的檔案描述符
                        </p>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.specialFiles}
                          onChange={(e) => setConfig(prev => ({ ...prev, specialFiles: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                          允許特殊檔案
                        </label>
                        <p className="ml-4 text-xs text-gray-500 dark:text-gray-400">
                          不刪除特殊檔案 (裝置檔案等)
                        </p>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.ttyHack}
                          onChange={(e) => setConfig(prev => ({ ...prev, ttyHack: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                          TTY Hack
                        </label>
                        <p className="ml-4 text-xs text-gray-500 dark:text-gray-400">
                          針對需要 TTY 的程式的特殊處理
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          執行用戶 UID
                        </label>
                        <input
                          type="text"
                          value={config.asUid}
                          onChange={(e) => setConfig(prev => ({ ...prev, asUid: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="1000"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          指定程式執行的用戶 ID
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          執行群組 GID
                        </label>
                        <input
                          type="text"
                          value={config.asGid}
                          onChange={(e) => setConfig(prev => ({ ...prev, asGid: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="1000"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          指定程式執行的群組 ID
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "program" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">程式設定</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        程式路徑
                      </label>
                      <input
                        type="text"
                        value={config.program}
                        onChange={(e) => setConfig(prev => ({ ...prev, program: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="/bin/bash"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        要執行的程式路徑
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        程式參數
                      </label>
                      <input
                        type="text"
                        value={config.arguments}
                        onChange={(e) => setConfig(prev => ({ ...prev, arguments: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="-c 'echo Hello World'"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        傳遞給程式的參數
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "presets" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">配置管理</h3>

                    {/* 預設配置 */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">預設配置</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(presetConfigs).map(([key, preset]) => (
                          <div key={key} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h5 className="font-medium text-gray-900 dark:text-white mb-2">{preset.name}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{preset.description}</p>
                            <button
                              onClick={() => applyPreset(key)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                              套用配置
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 配置匯出匯入 */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">配置匯出/匯入</h4>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={exportConfig}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          匯出配置
                        </button>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".json"
                            onChange={importConfig}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium w-full">
                            匯入配置
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        配置將以 JSON 格式儲存和載入
                      </p>
                    </div>

                    {/* 重置配置 */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">重置配置</h4>
                      <button
                        onClick={() => setConfig({
                          boxId: "0",
                          metaFile: "",
                          stdin: "",
                          stdout: "",
                          stderr: "",
                          stderrToStdout: false,
                          chdir: "",
                          verbose: false,
                          silent: false,
                          wait: false,
                          memory: "",
                          time: "",
                          wallTime: "",
                          extraTime: "",
                          stack: "",
                          openFiles: "",
                          fileSize: "",
                          quotaBlocks: "",
                          quotaInodes: "",
                          coreSize: "",
                          processes: "",
                          envVars: [],
                          fullEnv: false,
                          directories: [],
                          noDefaultDirs: false,
                          enableCg: false,
                          cgMem: "",
                          shareNet: false,
                          inheritFds: false,
                          specialFiles: false,
                          ttyHack: false,
                          asUid: "",
                          asGid: "",
                          program: "",
                          arguments: "",
                        })}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        重置所有配置
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        將所有配置恢復為預設值
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Command Output Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-8">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    生成的命令
                  </h3>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                    自動更新
                  </span>
                </div>

                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all font-mono">
                    {generatedCommand || "配置您的選項，命令將自動生成"}
                  </pre>
                </div>

                {generatedCommand && (
                  <div className="mt-4">
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedCommand)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      複製命令
                    </button>
                  </div>
                )}

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    使用步驟
                  </h4>
                  <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-start">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">1</span>
                      執行 <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">isolate --init</code>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">2</span>
                      準備程式檔案和輸入資料
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">3</span>
                      執行生成的命令
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">4</span>
                      執行 <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">isolate --cleanup</code>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
