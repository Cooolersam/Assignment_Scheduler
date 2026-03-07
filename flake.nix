{
  description = "Unified Isolated Dev Environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { nixpkgs, ... } @ inputs:
  let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    lib = pkgs.lib;
  in
  {
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = with pkgs; [
          jdk25
          eza
      ];

      shellHook = ''
        #alias ls=eza
        #alias ls="ls -alh --color=auto"
        alias ls="eza --long --group--header -a --classify --links --level=3 --color=auto --sort=type --time-style=long-iso --extended"
        alias find=fd
        alias fd="fd --hidden --list-details --color=auto"
        #alias fd="find -L"
        alias du="duf"

        alias gst="git status"
        alias gc="git commit"
        alias gcm="git commit -m"
        alias ga="git add"
        alias gaa="git add --all"
        alias gcl="git clone -v --progress"
        alias gb="git branch"
        alias gp="git push -u"
        alias gpu="git push -u"

        [ -x ~/.bashrc ] && source ~/.bashrc
        [ -x ~/.zshrc ] && source ~/.zshrc
      '';
    };
  };
}
