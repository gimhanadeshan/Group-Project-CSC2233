@props([
    'url',
    'color' => 'primary',
    'align' => 'center',
])
<table class="action" align="center" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center">
                        <a href="{{ $url }}" class="button button-primary" style="background-color: #003366; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                            {{ $slot }}
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
