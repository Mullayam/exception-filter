
import process from 'node:process'
import os from 'node:os'
import * as fs from 'fs'
import path from 'node:path'
import { osInfo, sysInfo } from './types'

export namespace Info {

    export class System {
        private cpus: os.CpuInfo[] = os.cpus()
        /**
         * Retrieves system information.
         *
         * @return {sysInfo} An object containing various system information.
         */
        sys(): sysInfo {
            return {
                node: process.versions,
                uptime: os.uptime(),
                command_executed: process.title,
                pid: process.pid,
                features: process.features,
                homeDirectory: os.homedir()
            }
        }
        cpu() {
            return {
                cores: this.cpus.length,
                speed: this.cpus.reduce(function sum(memo, cpu) {
                    return memo + cpu.speed;
                }, 0) / this.cpus.length,
                model: this.cpus[0].model
            }
        }
        os(): osInfo{
            return {
                platform: process.platform,
                arch: process.arch,
                hostname: os.hostname(),
                machine: os.machine(),
                version: os.version(),
            }
        }
        memory() {
            return {
                freemem: os.freemem(),
                totalmem: os.totalmem(),
                laod: {
                    1: os.loadavg()[0],
                    5: os.loadavg()[1],
                    15: os.loadavg()[2]
                }

            }
        }
        environment() {
            return {
                args: process.argv,
                node: process.execPath,
                cwd: process.cwd(),
                // env: Object.keys(process.env).sort().reduce(function reassemble(memo, key) {
                //   memo[key] = process.env[key];
                //   return memo;
                // }, {}),
                gid: process.pid,
                network: os.networkInterfaces()

            }
        }
        exception() {
            return {
                // heapdump: path.resolve(this.directory, 'exceptions', this.filename) +'.heapsnapshot',
                // ocurred: new Date(),
                // ms: Date.now(),
                // message: this.message,
                // stacktrace: this.stack.split('\n').map(function map(line) {
                //   return line.trim();
                // }).filter(Boolean),
                // line: (failing(this) || []).filter(function filter(stack) {
                //   return stack.failed;
                // })
            }
        }
        private ReadPackageJson() {
            const content = fs.readFileSync(`${path.join(process.cwd(), "package.json")}`, { encoding: 'utf8' })
            const FileObject = JSON.parse(content)
            return {
                name: FileObject.name,
                version: FileObject.version,
                mainfile: FileObject.main,
                dependencies: FileObject.dependencies,
                devDependencies: FileObject.devDependencies

            }
        }
    }
}