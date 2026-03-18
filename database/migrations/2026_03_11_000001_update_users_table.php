<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add new columns for TunaWicara
            $table->renameColumn('name', 'name'); // Keep existing
            $table->string('username', 50)->unique()->after('email')->comment('Username unik');
            $table->string('avatar_path', 500)->nullable()->after('username');
            $table->text('bio')->nullable()->after('avatar_path');
            $table->enum('role', ['learner', 'deaf_mute', 'admin'])->default('learner')->after('bio');
            $table->string('oauth_provider', 20)->nullable()->after('role');
            $table->string('oauth_id', 100)->nullable()->after('oauth_provider');
            $table->timestamp('last_login_at')->nullable()->after('email_verified_at');
            $table->tinyInteger('is_active')->default(1)->after('last_login_at');
            $table->softDeletes()->after('updated_at');
            
            // Add unique constraint for OAuth
            $table->unique(['oauth_provider', 'oauth_id'])->comment('Unique OAuth identifier');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['oauth_provider', 'oauth_id']);
            $table->dropSoftDeletes();
            $table->dropColumn([
                'username',
                'avatar_path',
                'bio',
                'role',
                'oauth_provider',
                'oauth_id',
                'last_login_at',
                'is_active'
            ]);
        });
    }
};
