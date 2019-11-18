const url = require(`url`);
const path = require(`path`);
const app = require(`./app`);
const util = require(`../app/utility`);
const argUtils = require(`../app/args`);
const prompts = require(`../app/prompt`);
const Generator = require(`yeoman-generator`);

module.exports = class extends Generator {
   // The name `constructor` is important here
   constructor(args, opts) {
      // Calling the super constructor is important so our generator is correctly set up
      super(args, opts);

      // Order is important 
      argUtils.applicationType(this);
      argUtils.applicationName(this);
      argUtils.p12File(this);
      argUtils.provisionningProfile(this);
      argUtils.keystoreFile(this);
      argUtils.packageName(this);
      argUtils.tfs(this);
      argUtils.queue(this);
      argUtils.target(this);
      argUtils.dockerHost(this);
      argUtils.dockerRegistry(this);
      argUtils.dockerRegistryId(this);
      argUtils.pat(this);
      argUtils.customFolder(this);
   }

   // 2. Where you prompt users for options (where you`d call this.prompt())
   prompting() {
      // Collect any missing data from the user.
      // This gives me access to the generator in the
      // when callbacks of prompt
      let cmdLnInput = this;

      return this.prompt([
         prompts.tfs(this),
         prompts.pat(this),
         prompts.queue(this),
         prompts.applicationType(this),
         prompts.packageName(this),
         prompts.applicationName(this),
         prompts.p12File(this),
         prompts.p12Pwd(this),
         prompts.provisionningProfile(this),
         prompts.keystoreFile(this),
         prompts.keystoreAliasname(this),
         prompts.keystorePwd(this),
         prompts.keystoreKeyPwd(this),
         prompts.customFolder(this),
         prompts.target(this),
         prompts.dockerHost(this),
         prompts.dockerRegistry(this),
         prompts.dockerRegistryUsername(this)
      ]).then(function (answers) {
         // Transfer answers (a) to global object (cmdLnInput) for use in the rest
         // of the generator
         // If the gave you a answer from the prompt use it. If not check the 
         // command line.  If that is blank for some return `` so code does not
         // crash with undefined later on.
         this.pat = util.reconcileValue(cmdLnInput.options.pat, answers.pat);
         this.tfs = util.reconcileValue(cmdLnInput.options.tfs, answers.tfs);
         this.type = util.reconcileValue(cmdLnInput.options.type, answers.type);
         this.queue = util.reconcileValue(cmdLnInput.options.queue, answers.queue);
         this.target = util.reconcileValue(cmdLnInput.options.target, answers.target);
         this.dockerHost = util.reconcileValue(cmdLnInput.options.dockerHost, answers.dockerHost, ``);
         this.customFolder = util.reconcileValue(cmdLnInput.options.customFolder, answers.customFolder, ``);
         this.dockerRegistry = util.reconcileValue(cmdLnInput.options.dockerRegistry, answers.dockerRegistry, ``);
         this.applicationName = util.reconcileValue(cmdLnInput.options.applicationName, answers.applicationName, ``);
         this.p12File = util.reconcileValue(cmdLnInput.options.p12File, answers.p12File, ``);
         this.p12Pwd = util.reconcileValue(cmdLnInput.options.p12Pwd, answers.p12Pwd);
         this.provisionningProfile = util.reconcileValue(cmdLnInput.options.provisionningProfile, answers.provisionningProfile, ``);
         this.keystoreFile = util.reconcileValue(cmdLnInput.options.keystoreFile, answers.keystoreFile, ``);
         this.keystoreAliasname = util.reconcileValue(cmdLnInput.options.keystoreAliasname, answers.keystoreAliasname, ``);
         this.keystoreKeyPwd = util.reconcileValue(cmdLnInput.options.keystoreKeyPwd, answers.keystoreKeyPwd, ``);
         this.keystorePwd = util.reconcileValue(cmdLnInput.options.keystorePwd, answers.keystorePwd, ``);
         this.packageName = util.reconcileValue(cmdLnInput.options.packageName, answers.packageName, ``);
         this.dockerRegistryId = util.reconcileValue(cmdLnInput.options.dockerRegistryId, answers.dockerRegistryId, ``);
      }.bind(this));
   }

   // 5. Where you write the generator specific files (routes, controllers, etc)
   writing() {
      // This will not match in callback of
      // getBuild so store it here.
      var _this = this;
      var done = this.async();

      app.getBuild(this, function (e, result) {
         var build = _this.templatePath(result);

         if (_this.type === `custom`) {
            build = path.join(_this.customFolder, result);
         }

         var args = {
            pat: _this.pat,
            tfs: _this.tfs,
            type: _this.type,
            buildJson: build,
            queue: _this.queue,
            target: _this.target,
            appName: _this.applicationName,
            packageName: _this.packageName,
            p12File: _this.p12File,
            p12Pwd: _this.p12Pwd,
            provisionningProfile: _this.provisionningProfile,
            keystoreFile: _this.keystoreFile,
            keystoreAliasname: _this.keystoreAliasname,
            keystoreKeyPwd: _this.keystoreKeyPwd,
            keystorePwd: _this.keystorePwd,
            project: _this.applicationName
         };

         if (util.isDocker(_this.target)) {
            args.dockerHost = _this.dockerHost;
            args.dockerRegistry = _this.dockerRegistry;
            args.dockerRegistryId = _this.dockerRegistryId;
         }

         app.run(args, _this, done);
      });
   }
};