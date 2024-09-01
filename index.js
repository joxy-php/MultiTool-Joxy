const figlet = require('figlet');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Import axios for HTTP requests
const dns = require('dns'); // Import DNS module for resolving IPs
const ping = require('ping'); // Import ping module for pinging IPs

// Create a function to handle all the dynamic imports
const setup = async () => {
    const { default: chalk } = await import('chalk');
    const { default: open } = await import('open');

    const LOG_FILE_PATH = path.join(__dirname, 'links.log');
    const ACCESS_LOG_FILE_PATH = path.join(__dirname, 'access.log');

    // Create ASCII art for the title
    const title = figlet.textSync(`joxy`, {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    });

    console.log(chalk.hex('#ff00ff')(title)); // Title in pink color

    // Subtitle
    console.log(chalk.redBright('( Type "help" for Commands )'));
    console.log(chalk.redBright('( Discord: edu.uk )\n'));

    // Footer
    console.log(chalk.greenBright('\n(joxy@root) ') + chalk.whiteBright('> '));

    // Create readline interface
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Function to log created links
    const logLink = (link) => {
        fs.appendFile(LOG_FILE_PATH, `${new Date().toISOString()} - ${link}\n`, (err) => {
            if (err) {
                console.error(chalk.redBright('Error logging link:', err.message));
            } else {
                console.log(chalk.greenBright('Link logged successfully.'));
            }
        });
    };

    // Function to log access
    const logAccess = (link) => {
        fs.appendFile(ACCESS_LOG_FILE_PATH, `${new Date().toISOString()} - ${link}\n`, (err) => {
            if (err) {
                console.error(chalk.redBright('Error logging access:', err.message));
            } else {
                console.log(chalk.greenBright('Access logged successfully.'));
            }
        });
    };

    // Validate IP Address
    const validateIP = (ip) => {
        const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    };

    // Ping an IP Address
    const pingIP = async (ip) => {
        try {
            const res = await ping.promise.probe(ip);
            if (res.alive) {
                console.log(chalk.greenBright(`IP Address ${ip} is reachable.`));
                console.log(chalk.greenBright(`Response time: ${res.time} ms`));
            } else {
                console.log(chalk.redBright(`IP Address ${ip} is not reachable.`));
            }
        } catch (err) {
            console.error(chalk.redBright('Error pinging IP address:', err.message));
        }
    };

    // Perform DNS Lookup
    const dnsLookup = (domain) => {
        dns.lookup(domain, (err, ip) => {
            if (err) {
                console.error(chalk.redBright('Error resolving domain:', err.message));
            } else {
                console.log(chalk.greenBright(`Domain ${domain} resolved to IP ${ip}`));
            }
        });
    };

    // Command handler
    const handleCommand = async (input) => {
        const command = input.trim().toLowerCase();

        switch (command) {
            case 'help':
                console.log(chalk.yellowBright('Available Commands:'));
                console.log(chalk.greenBright('help') + ' - Show this help message');
                console.log(chalk.greenBright('pusiga') + ' - Open a YouTube link');
                console.log(chalk.greenBright('ipgrabber') + ' - Create an IP logging link');
                console.log(chalk.greenBright('ping') + ' - Ping an IP address');
                console.log(chalk.greenBright('dnslookup') + ' - Perform DNS lookup for a domain');
                console.log(chalk.greenBright('status') + ' - Show the current status');
                console.log(chalk.greenBright('info') + ' - Display system information');
                break;
            case 'pusiga':
                console.log(chalk.cyan('Executing pusiga command...'));

                // Open a URL in the default browser
                await open('https://youtu.be/dQw4w9WgXcQ?si=2SUiM2YAXpDiffpz').catch(err => console.error('Error opening URL:', err));
                break;
            case 'ipgrabber':
                console.log(chalk.cyan('Executing ipgrabber command...'));

                // Prompt user for TikTok URL
                rl.question(chalk.greenBright('Paste the TikTok URL to shorten: '), async (tiktokUrl) => {
                    try {
                        // Replace this with the actual URL and parameters as per Grabify's API requirements
                        const response = await axios.post('https://grabify.org/ip-grabber/', {
                            url: tiktokUrl
                        });

                        const shortLink = response.data.short_url; // Replace with correct property from response
                        const shortLinkWithPrefix = `https://grabify.org/${shortLink}`;

                        // Log the generated short link
                        logLink(shortLinkWithPrefix);

                        // Display the generated link
                        console.log(chalk.greenBright(`Your short link is: ${shortLinkWithPrefix}`));
                        
                        // Optionally, log access if you have a mechanism to track it
                        // Example: logAccess(shortLinkWithPrefix);
                    } catch (error) {
                        console.error(chalk.redBright('Error creating short link:', error.message));
                    }
                });
                break;
            case 'ping':
                console.log(chalk.cyan('Executing ping command...'));

                // Prompt user for IP address or domain
                rl.question(chalk.greenBright('Enter IP address or domain to ping: '), async (address) => {
                    if (validateIP(address)) {
                        // If address is an IP, ping it
                        await pingIP(address);
                    } else {
                        // Resolve domain to IP and ping
                        dns.lookup(address, async (err, ip) => {
                            if (err) {
                                console.error(chalk.redBright('Error resolving domain:', err.message));
                            } else {
                                console.log(chalk.cyan(`Resolved ${address} to IP ${ip}`));
                                await pingIP(ip);
                            }
                        });
                    }
                });
                break;
            case 'dnslookup':
                console.log(chalk.cyan('Executing DNS lookup command...'));

                // Prompt user for domain
                rl.question(chalk.greenBright('Enter domain to lookup: '), (domain) => {
                    dnsLookup(domain);
                });
                break;
            case 'status':
                console.log(chalk.magenta('System Status: All systems operational.'));
                break;
            case 'info':
                console.log(chalk.blue('System Information: Node.js v20.16.0, Environment: Development.'));
                break;
            case '/joxy':
                console.log(chalk.blueBright('Credits:'));
                console.log(chalk.greenBright('My Site:') + ' ' + chalk.yellowBright('rootjoxy.net'));
                console.log(chalk.greenBright('Message:') + ' ' + chalk.redBright('I use and support this program.'));
                break;
            default:
                console.log(chalk.redBright('Unknown command. Type "help" for a list of commands.'));
                break;
        }

        // Prompt for the next command
        rl.question(chalk.greenBright('\n(joxy@root) ') + chalk.whiteBright('> '), handleCommand);
    };

    // Initial prompt
    rl.question(chalk.greenBright('\n(joxy@root) ') + chalk.whiteBright('> '), handleCommand);
};

// Run the setup function
setup().catch(err => console.error('Setup error:', err));
