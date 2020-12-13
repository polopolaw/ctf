setlocal enableextensions enabledelayedexpansion
set t=%time:~3,2%
if %t:~0,1% EQU 0 set t=%t:~1,1%
set id=%1
call :strlen l1 id
set /a len=%l1%
if %len% LEQ 10 set /a len=%l1% * 10 + %l1%
echo %len%
set /a part = %len%/4
set /a tail = (%t% + %t% + %l1%) %% %len%
if %tail% LEQ %part% (
    echo No anomaly detected
    goto :eof
    )
if %tail% LEQ %part% * 2 (
    echo Tempo Fall detected
    goto :eof
    )
if %tail% LEQ %part% * 3 (
    echo No anomaly detected
    goto :eof
    )
if %tail% LEQ %part% * 4 (
    echo Beached Things detected
    goto :eof
    )

REM ********* function *****************************
:strlen <resultVar> <stringVar>
(
    setlocal EnableDelayedExpansion
    (set^ tmp=!%~2!)
    if defined tmp (
        set "len=1"
        for %%P in (4096 2048 1024 512 256 128 64 32 16 8 4 2 1) do (
            if "!tmp:~%%P,1!" NEQ "" (
                set /a "len+=%%P"
                set "tmp=!tmp:~%%P!"
            )
        )
    ) ELSE (
        set len=0
    )
)
(
    endlocal
    set "%~1=%len%"
    exit /b
)
